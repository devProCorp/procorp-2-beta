<?php
/**
 * 404 handler for the static export.
 *
 * The host ignores `ErrorDocument` in .htaccess (cPanel restricts
 * AllowOverrideList; mod_rewrite and mod_headers from the same file do work),
 * so Apache would answer unknown URLs with its bare "404 Not Found" instead of
 * the prerendered 404.html. This three-liner is reached via a rewrite fallback
 * and keeps the real 404 status while serving Next's error page.
 */
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/404.html');
