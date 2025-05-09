
export const markDownToHtml = (markdown: string) => {
    let html = markdown;

    // Convert headers
    html = html.replace(/^######\s(.+)/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s(.+)/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s(.+)/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s(.+)/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s(.+)/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s(.+)/gm, '<h1>$1</h1>');

    // Convert bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Convert italics
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Convert blockquotes
    html = html.replace(/^>\s(.+)/gm, '<blockquote>$1</blockquote>');

    // Convert unordered lists (supports nested lists)
    html = html.replace(/^(\s*)-\s(.+)/gm, (_, spaces, text) => {
        const depth = spaces.length / 2; // Assuming 2 spaces per level
        return `<li style="margin-left:${depth * 20}px;">${text}</li>`;
    });

    // Wrap list items in <ul>
    html = html.replace(/(<li.*?>.*?<\/li>)(?!\s*<li)/gms, '<ul>$1</ul>');

    // Convert code blocks
    html = html.replace(/```([^`]+)```/gms, '<pre><code>$1</code></pre>');
    
    // Convert hyperlinks
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert paragraphs
    html = html.replace(/^([^#<\-\s>].+)$/gm, '<p>$1</p>');

    return html.trim();
}