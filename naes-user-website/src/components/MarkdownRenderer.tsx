import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/markdown.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 自定义标题样式
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-8 mt-12 text-gray-900 border-b border-gray-200 pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mb-6 mt-12 text-gray-900 border-b border-gray-200 pb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-6 mt-10 text-gray-800">
              {children}
            </h3>
          ),
          
          // 自定义列表样式
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-8 space-y-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-8 space-y-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          
          // 自定义段落样式 - 处理图片段落
          p: ({ children, ...props }) => {
            // 检查是否包含图片
            const hasImage = React.Children.toArray(children).some(
              child => React.isValidElement(child) && child.type === 'img'
            );
            
            if (hasImage) {
              return <div className="my-12 text-center">{children}</div>;
            }
            
            return (
              <p className="mb-8 text-gray-700 leading-relaxed text-base" {...props}>
                {children}
              </p>
            );
          },
          
          // 自定义图片样式
          img: ({ src, alt }) => (
            <>
              <img 
                src={src} 
                alt={alt} 
                className="w-full max-w-3xl mx-auto rounded-lg shadow-lg block"
                loading="lazy"
              />
              {alt && (
                <span className="text-sm text-gray-500 mt-2 italic block">{alt}</span>
              )}
            </>
          ),
          
          // 自定义链接样式
          a: ({ href, children }) => (
            <a 
              href={href}
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;