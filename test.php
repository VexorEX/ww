<?php
//  index.php - Updated PHP Proxy for Telegram Bot API (TOKEN without 'bot' prefix)

//   لاگ‌گیری برای دیباگ (telegram_logs.txt)
function logRequest($data) {
    file_put_contents('telegram_logs.txt', date('Y-m-d H:i:s') . ' - ' . $data . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// پارس URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = array_filter(explode('/', trim($request_uri, '/')));

// بررسی ساختار: حداقل دو قسمت (TOKEN و method)
if (count($path_parts) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid URL format. Use /<TOKEN>/<method> or /bot<TOKEN>/<method>']);
    logRequest("Invalid path parts: " . implode('/', $path_parts));
    exit;
}

// استخراج TOKEN (از قسمت اول)
$token_part = $path_parts[0];
if (strpos($token_part, 'bot') === 0) {
    $token = substr($token_part, 3); // حذف 'bot' اگر وجود داشت
} else {
    $token = $token_part; // مستقیم TOKEN
}

$api_method = $path_parts[1]; // method مثل sendMessage

if (empty($token) || empty($api_method)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing token or API method']);
    logRequest("Empty token or method: token='$token', method='$api_method'");
    exit;
}

// ساخت URL تلگرام
$telegram_api_base = 'https://api.telegram.org/bot' . $token . '/';
$telegram_url = $telegram_api_base . $api_method;

// اضافه کردن query string (مثل ?chat_id=123&text=hello)
$query = $_SERVER['QUERY_STRING'] ?? '';
if ($query) {
    $telegram_url .= '?' . $query;
}

// خواندن داده‌های POST (JSON یا form-data)
$input = file_get_contents('php://input');
$method = $_SERVER['REQUEST_METHOD'];

// آماده‌سازی cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegram_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true); // SSL فعال (deact)
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'PHP-Telegram-Proxy/1.0');

// برای POST
if ($method === 'POST' && !empty($input)) {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    // هدرهای ورودی
    $headers = [];
    if (isset($_SERVER['CONTENT_TYPE'])) {
        $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
    }
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
}

// اجرای درخواست
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// لاگ درخواست
logRequest("Request: $method /$token_part/$api_method | Telegram URL: $telegram_url | Code: $http_code | Error: " . ($error ?? 'None'));

// برگرداندن پاسخ
http_response_code($http_code);
header('Content-Type: application/json; charset=utf-8');
if ($response) {
    echo $response;
} else {
    echo json_encode(['error' => 'Proxy error: ' . ($error ?? 'Unknown')]);
}
?>