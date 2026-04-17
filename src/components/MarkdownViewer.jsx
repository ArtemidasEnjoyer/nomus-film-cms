import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function MarkdownViewer({ content, className = '' }) {
  const parsed = marked.parse(content || '');
  const sanitized = DOMPurify.sanitize(parsed);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
