// Экранировать спецсимволы HTML для предотвращения XSS-атак
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}