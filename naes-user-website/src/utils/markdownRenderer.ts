// 简单的 Markdown 渲染工具
export const renderMarkdown = (content: string): string => {
  return content
    // 处理图片
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" class="w-full max-w-3xl mx-auto my-8 rounded-lg shadow-lg" />')
    
    // 处理标题
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-6 mt-10 text-gray-900 border-b border-gray-200 pb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-4 mt-8 text-gray-800">$1</h3>')
    
    // 处理列表
    .replace(/^\- (.*$)/gim, '<li class="mb-2 ml-4">$1</li>')
    
    // 处理段落 - 先处理换行，再包装段落
    .split('\n\n')
    .map(paragraph => {
      // 跳过已经是HTML标签的内容
      if (paragraph.trim().startsWith('<')) {
        return paragraph;
      }
      // 处理普通段落
      if (paragraph.trim()) {
        return `<p class="mb-6 text-gray-700 leading-relaxed">${paragraph.trim()}</p>`;
      }
      return '';
    })
    .join('\n')
    
    // 包装列表项
    .replace(/(<li class="mb-2 ml-4">.*<\/li>)/gs, '<ul class="list-disc pl-6 mb-6 space-y-2">$1</ul>')
    
    // 清理多余的空白
    .replace(/\n\s*\n/g, '\n');
};