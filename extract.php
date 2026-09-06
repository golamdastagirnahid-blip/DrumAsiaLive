<?php
// IONOS Instant Unzipper for DrumAsia Live
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/html; charset=utf-8');

 = __DIR__ . '/drumasia-live-website.zip';

echo '<!DOCTYPE html><html><head><title>DrumAsia IONOS Unpacker</title>';
echo '<style>body{background:#0b0c0e;color:#fff;font-family:sans-serif;padding:40px;text-align:center;}';
echo '.card{max-width:600px;margin:0 auto;background:#14161b;padding:30px;border-radius:12px;border:1px solid #333;}';
echo '.btn{display:inline-block;padding:14px 28px;background:#f59e0b;color:#000;text-decoration:none;font-weight:bold;border-radius:6px;margin-top:20px;}';
echo '</style></head><body><div class="card">';
echo '<h2>DRUMASIA LIVE — IONOS Server Setup</h2>';

if (!file_exists()) {
    echo '<p style="color:#ef4444;font-size:16px;">Error: <b>drumasia-live-website.zip</b> not found in the current directory.</p>';
    echo '<p style="color:#888;">Please ensure drumasia-live-website.zip is uploaded to the same folder as extract.php in your IONOS File Manager.</p>';
} else {
     = new ZipArchive;
     = ->open();
    if ( === TRUE) {
        ->extractTo(__DIR__);
        ->close();
        echo '<p style="color:#10b981;font-size:20px;font-weight:bold;">SUCCESS! All files, scripts, images & folders extracted successfully!</p>';
        echo '<p style="color:#aaa;">Your website is fully deployed and ready.</p>';
        echo '<a class="btn" href="/">VISIT DRUM ASIA LIVE NOW &rarr;</a>';
    } else {
        echo '<p style="color:#ef4444;">Failed to open zip file. Error code: ' .  . '</p>';
    }
}
echo '</div></body></html>';
