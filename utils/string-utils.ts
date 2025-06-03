/**
 * 解码 HTML 实体
 * @param html 包含 HTML 实体的文本
 * @returns 解码后的文本
 */
export function decodeHtml(html: string | undefined | null): string {
    if (!html) return '';
    
    const entities: { [key: string]: string } = {
        // 基本符号
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '=',
        
        // 破折号
        '&mdash;': '—',
        '&ndash;': '–',
        
        // 数学符号
        '&times;': '×',
        '&divide;': '÷',
        '&plusmn;': '±',
        '&deg;': '°',
        
        // 引号
        '&ldquo;': '"',
        '&rdquo;': '"',
        '&lsquo;': "'",
        '&rsquo;': "'",
        
        // 其他常用符号
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™',
        '&euro;': '€',
        '&pound;': '£',
        '&yen;': '¥',
        '&cent;': '¢',
        '&sect;': '§',
        '&para;': '¶',
        '&bull;': '•',
        '&hellip;': '…',
        '&middot;': '·',
        '&nbsp;': ' '
    };
    
    return html.replace(/&[^;]+;/g, entity => entities[entity] || entity);
} 