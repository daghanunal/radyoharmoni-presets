<?php
/*
 * Radyo Harmoni forms: contact, photo sharing, subscribe. Replaces the WordPress contact form.
 * POST JSON { type, ...fields, website (honeypot, must be empty), started (ms), token (reCAPTCHA v3) }.
 * Mail goes to info@radyoharmoni.org through AhaSend (SMTP); subscribers are kept outside the web root.
 * Settings live in rh-config.php one level above the web root (see deploy/rh-config.sample.php), never in this file.
 */
declare(strict_types=1);
ini_set('display_errors', '0');   // warnings go to the log, never into the JSON reply
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') reply(405, ['ok' => false, 'error' => 'POST only']);

$configFile = dirname($_SERVER['DOCUMENT_ROOT'] ?: __DIR__ . '/..') . '/rh-config.php';
if (getenv('RH_CONFIG')) $configFile = getenv('RH_CONFIG');
if (!is_file($configFile)) reply(503, ['ok' => false, 'error' => 'The form is not set up yet.']);
$cfg = require $configFile;

// Same site only
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $cfg['allowed_origins'], true)) reply(403, ['ok' => false, 'error' => 'Forbidden']);

$in_fh = fopen('php://input', 'rb');
$raw = $in_fh ? (string)stream_get_contents($in_fh, 20000) : '';
$in = json_decode($raw, true);
if (!is_array($in)) reply(400, ['ok' => false, 'error' => 'Bad request']);

$clean = fn($v, $max) => trim(mb_substr(str_replace(["\r", "\0"], '', (string)($v ?? '')), 0, $max));
$type = $clean($in['type'] ?? '', 20);
if (!in_array($type, ['contact', 'photo', 'subscribe'], true)) reply(400, ['ok' => false, 'error' => 'Bad request']);

// Bots: a hidden field people never fill, and a form sent faster than anyone can type
$honeypot = $clean($in['website'] ?? '', 200);
$started = (int)($in['started'] ?? 0);
$elapsed = (int)(microtime(true) * 1000) - $started;
if ($honeypot !== '' || ($type !== 'subscribe' && $elapsed < 3000)) reply(200, ['ok' => true]);   // quietly ignored

// Rate limit: a few messages per address in ten minutes
$dataDir = rtrim($cfg['data_dir'], '/');
if (!is_dir($dataDir)) @mkdir($dataDir, 0750, true);
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$bucket = $dataDir . '/rate-' . hash('sha256', $ip . date('Y-m-d-H') . (int)(date('i') / 10)) . '.txt';
$count = (int)@file_get_contents($bucket);
if ($count >= 5) reply(429, ['ok' => false, 'error' => 'Too many messages. Please try again a little later.']);
@file_put_contents($bucket, (string)($count + 1));
foreach (glob($dataDir . '/rate-*.txt') ?: [] as $old) if (filemtime($old) < time() - 1800) @unlink($old);

// reCAPTCHA v3, when a secret is configured
if (!empty($cfg['recaptcha_secret'])) {
    $token = $clean($in['token'] ?? '', 4000);
    if ($token === '') reply(400, ['ok' => false, 'error' => 'Please reload the page and try again.']);
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'timeout' => 8, 'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query(['secret' => $cfg['recaptcha_secret'], 'response' => $token, 'remoteip' => $ip])]]);
    $v = json_decode((string)@file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx), true);
    if (!is_array($v) || empty($v['success']) || ($v['score'] ?? 0) < ($cfg['recaptcha_min_score'] ?? 0.5)) {
        reply(400, ['ok' => false, 'error' => 'We could not confirm you are not a robot. Please try again.']);
    }
}

$email = $clean($in['email'] ?? '', 200);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(400, ['ok' => false, 'error' => 'Please enter a valid email address.']);
$first = $clean($in['first_name'] ?? ($in['name'] ?? ''), 100);
$last = $clean($in['last_name'] ?? '', 100);
$message = $clean($in['message'] ?? '', 5000);
$place = $clean($in['place'] ?? '', 200);
$link = $clean($in['link'] ?? '', 500);
$optin = !empty($in['optin']) || $type === 'subscribe';
if ($type === 'contact' && ($first === '' || $message === '')) reply(400, ['ok' => false, 'error' => 'Please fill in your name and a message.']);
if ($type === 'photo' && $first === '') reply(400, ['ok' => false, 'error' => 'Please fill in your name.']);
if ($link !== '' && !preg_match('~^https?://~i', $link)) reply(400, ['ok' => false, 'error' => 'The photo link should start with https://']);

// Keep subscribers on the server, outside the web root
if ($optin) {
    $csv = $dataDir . '/subscribers.csv';
    $new = !is_file($csv);
    $fh = fopen($csv, 'a');
    if ($fh && flock($fh, LOCK_EX)) {
        if ($new) fputcsv($fh, ['date', 'email', 'first_name', 'last_name', 'source'], ',', '"', '');
        fputcsv($fh, [gmdate('c'), $email, $first, $last, $type], ',', '"', '');
        flock($fh, LOCK_UN);
    }
    if ($fh) fclose($fh);
}

$name = trim("$first $last");
$subjects = ['contact' => 'Contact', 'photo' => 'Photo for the player', 'subscribe' => 'New subscriber'];
$subject = 'Radyo Harmoni: ' . $subjects[$type] . ($name !== '' ? " from $name" : '');
$lines = ["Name: $name", "Email: $email"];
if ($place !== '') $lines[] = "Place: $place";
if ($link !== '') $lines[] = "Photos: $link";
if ($type !== 'subscribe') $lines[] = 'Wants updates: ' . ($optin ? 'yes' : 'no');
if ($message !== '') $lines[] = "\n$message";
$lines[] = "\n--\nSent from radyoharmoni.org (" . $type . ')';
$body = implode("\n", $lines);

try {
    send_mail($cfg, $cfg['to'], $subject, $body, $email, $name);
} catch (Throwable $e) {
    error_log('radyoharmoni form: ' . $e->getMessage());
    reply(502, ['ok' => false, 'error' => 'Your message could not be sent. Please write to ' . $cfg['to'] . '.']);
}
reply(200, ['ok' => true]);

/* ── Mail: AhaSend over SMTP with STARTTLS, or the server's mail() if no SMTP is configured ── */
function send_mail(array $cfg, string $to, string $subject, string $body, string $replyTo, string $replyName): void {
    $from = $cfg['from'];
    $encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $replyHeader = $replyName !== '' ? '=?UTF-8?B?' . base64_encode($replyName) . "?= <$replyTo>" : $replyTo;
    $headers = [
        'From: =?UTF-8?B?' . base64_encode('Radyo Harmoni') . "?= <$from>",
        "Reply-To: $replyHeader",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Date: ' . date('r'),
        'Message-ID: <' . bin2hex(random_bytes(12)) . '@radyoharmoni.org>',
    ];
    if (empty($cfg['smtp']['host'])) {
        if (!mail($to, $encSubject, $body, implode("\r\n", $headers), '-f' . $from)) throw new RuntimeException('mail() failed');
        return;
    }
    $s = $cfg['smtp'];
    $fp = stream_socket_client("tcp://{$s['host']}:{$s['port']}", $errno, $errstr, 10);
    if (!$fp) throw new RuntimeException("SMTP connect: $errstr");
    stream_set_timeout($fp, 15);
    $read = function () use ($fp): string {
        $data = '';
        while (($line = fgets($fp, 1024)) !== false) { $data .= $line; if (strlen($line) < 4 || $line[3] === ' ') break; }
        return $data;
    };
    $cmd = function (?string $c, int $expect) use ($fp, $read): string {
        if ($c !== null) fwrite($fp, $c . "\r\n");
        $r = $read();
        if ((int)substr($r, 0, 3) !== $expect) throw new RuntimeException('SMTP ' . ($c ? strtok($c, ' ') : 'greeting') . ': ' . trim($r));
        return $r;
    };
    $cmd(null, 220);
    $cmd('EHLO radyoharmoni.org', 250);
    $cmd('STARTTLS', 220);
    if (isset($s['verify']) && $s['verify'] === false) {   // only for local testing against a self-signed server
        stream_context_set_option($fp, 'ssl', 'verify_peer', false);
        stream_context_set_option($fp, 'ssl', 'verify_peer_name', false);
        stream_context_set_option($fp, 'ssl', 'allow_self_signed', true);
    }
    if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) throw new RuntimeException('SMTP TLS failed');
    $cmd('EHLO radyoharmoni.org', 250);
    $cmd('AUTH PLAIN ' . base64_encode("\0{$s['user']}\0{$s['pass']}"), 235);
    $cmd("MAIL FROM:<$from>", 250);
    $cmd("RCPT TO:<$to>", 250);
    $cmd('DATA', 354);
    $msg = implode("\r\n", array_merge(["To: $to", "Subject: $encSubject"], $headers)) . "\r\n\r\n"
         . preg_replace('/^\./m', '..', str_replace("\n", "\r\n", $body));
    $cmd($msg . "\r\n.", 250);
    fwrite($fp, "QUIT\r\n");
    fclose($fp);
}
