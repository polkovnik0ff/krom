<?php
define('EMAIL_TO',  'pa@atwinta.ru');
define('EMAIL_FROM','noreply@hitcom-stanki.ru');
define('CSV_FILE',  __DIR__ . '/data/leads.csv');
define('RATE_LIMIT', 3); // max submissions per IP per minute

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false]));
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    http_response_code(400);
    exit(json_encode(['ok' => false]));
}

// Honeypot — боты заполняют скрытое поле
if (!empty($body['website'])) {
    exit(json_encode(['ok' => true]));
}

// Rate limit по IP (файловый, без БД)
$ip      = preg_replace('/[^0-9a-f:.]/', '', $_SERVER['REMOTE_ADDR'] ?? '0');
$rl_file = sys_get_temp_dir() . '/hitcom_rl_' . md5($ip) . '.json';
$now     = time();
$rl      = file_exists($rl_file) ? (json_decode(file_get_contents($rl_file), true) ?: []) : [];
if (empty($rl['reset']) || $now > $rl['reset']) {
    $rl = ['count' => 0, 'reset' => $now + 60];
}
$rl['count']++;
file_put_contents($rl_file, json_encode($rl), LOCK_EX);
if ($rl['count'] > RATE_LIMIT) {
    http_response_code(429);
    exit(json_encode(['ok' => false, 'error' => 'too_many_requests']));
}

// Санитизация
function clean(string $s): string {
    return mb_substr(strip_tags(str_replace(["\r", "\n", "\t"], ' ', trim($s))), 0, 500);
}

$type    = clean($body['type']    ?? '');
$name    = clean($body['name']    ?? '');
$contact = clean($body['contact'] ?? '');
$city    = clean($body['city']    ?? '');
$message = clean($body['message'] ?? '');

if ($contact === '' && $name === '') {
    http_response_code(400);
    exit(json_encode(['ok' => false, 'error' => 'empty_form']));
}

$type_labels = [
    'kp'      => 'Коммерческое предложение',
    'consult' => 'Консультация',
    'price'   => 'Фиксация цены',
    'call'    => 'Обратный звонок',
    'mag'     => 'Материал',
];
$type_label = $type_labels[$type] ?? $type;
$date = date('d.m.Y H:i:s');

// Запись в CSV
$csv_dir = dirname(CSV_FILE);
if (!is_dir($csv_dir)) {
    mkdir($csv_dir, 0755, true);
}
$csv_new = !file_exists(CSV_FILE);
$fh = fopen(CSV_FILE, 'a');
if ($fh) {
    flock($fh, LOCK_EX);
    if ($csv_new) {
        fputcsv($fh, ['Дата', 'Тип заявки', 'Имя', 'Контакт', 'Город', 'Сообщение'], ';');
    }
    fputcsv($fh, [$date, $type_label, $name, $contact, $city, $message], ';');
    flock($fh, LOCK_UN);
    fclose($fh);
}

// Отправка письма
$subject = "Новая заявка HITCOM: {$type_label}";
$lines   = ["Дата: {$date}", "Тип: {$type_label}"];
if ($name)    $lines[] = "Имя: {$name}";
if ($contact) $lines[] = "Контакт: {$contact}";
if ($city)    $lines[] = "Город: {$city}";
if ($message) $lines[] = "Сообщение: {$message}";
$email_body = implode("\n", $lines);

$headers = implode("\r\n", [
    'From: HITCOM <' . EMAIL_FROM . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
]);
$encoded_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

mail(EMAIL_TO, $encoded_subject, $email_body, $headers);

exit(json_encode(['ok' => true]));
