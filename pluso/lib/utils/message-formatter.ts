// lib/utils/message-formatter.ts

import { COLORS } from '../constants/styles.ts';
import type { MessageFormatting, FormattedMessage } from '../types/message-formatting.ts';

export class MessageFormatter {
  private static readonly MARKDOWN_PATTERNS = {
    bold: /\*\*(.*?)\*\*/g,
    italic: /_(.*?)_/g,
    code: /`(.*?)`/g,
    bulletList: /^[-*]\s(.+)$/gm,
    numberedList: /^\d+\.\s(.+)$/gm,
    paragraph: /\n\n(.+?)\n\n/g,
  };

  static formatContent(content: string): FormattedMessage {
    const formatting: MessageFormatting = {
      listType: 'none',
      colorAccent: 'none',
      paragraphSpacing: 'normal',
    };

    // Detect formatting based on content
    if (content.match(this.MARKDOWN_PATTERNS.bulletList)) {
      formatting.listType = 'bullet';
    } else if (content.match(this.MARKDOWN_PATTERNS.numberedList)) {
      formatting.listType = 'numbered';
    }

    // Convert markdown to HTML with tailwind classes
    let formattedContent = content
      // Bold
      .replace(this.MARKDOWN_PATTERNS.bold, '<span class="font-bold">$1</span>')
      // Italic
      .replace(this.MARKDOWN_PATTERNS.italic, '<span class="italic">$1</span>')
      // Code
      .replace(this.MARKDOWN_PATTERNS.code, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      // Lists
      .replace(this.MARKDOWN_PATTERNS.bulletList, (match, p1) => 
        `<li class="ml-4 before:content-['•'] before:mr-2 text-gray-800">${p1}</li>`)
      .replace(this.MARKDOWN_PATTERNS.numberedList, (match, p1, index) => 
        `<li class="ml-4 list-decimal text-gray-800">${p1}</li>`);

    // Add subtle color accents for different message types
    const colorClasses = {
      assistant: `border-l-4 border-${COLORS.brand.blue} pl-4`,
      system: `border-l-4 border-${COLORS.brand.cyan} pl-4`,
      user: '',
    };

    // Wrap in appropriate container
    formattedContent = `
      <div class="message-content space-y-2 ${colorClasses[formatting.type] || ''}">
        ${formattedContent}
      </div>
    `;

    return {
      content: formattedContent,
      type: 'assistant',
      timestamp: Date.now(),
      formatting,
    };
  }

  static applyEmphasis(message: FormattedMessage): FormattedMessage {
    if (!message.formatting.emphasis) return message;

    const emphasisClasses = {
      info: {
        subtle: 'bg-blue-50 text-blue-800',
        moderate: 'bg-blue-100 text-blue-900',
        strong: 'bg-blue-200 text-blue-900',
      },
      warning: {
        subtle: 'bg-yellow-50 text-yellow-800',
        moderate: 'bg-yellow-100 text-yellow-900',
        strong: 'bg-yellow-200 text-yellow-900',
      },
      success: {
        subtle: 'bg-green-50 text-green-800',
        moderate: 'bg-green-100 text-green-900',
        strong: 'bg-green-200 text-green-900',
      },
      error: {
        subtle: 'bg-red-50 text-red-800',
        moderate: 'bg-red-100 text-red-900',
        strong: 'bg-red-200 text-red-900',
      },
    };

    const { type, level } = message.formatting.emphasis;
    const emphasisClass = emphasisClasses[type][level];

    message.content = `<div class="${emphasisClass} p-2 rounded-md">${message.content}</div>`;
    return message;
  }

  static formatServerResponse(content: string): string {
    // Server-side formatting (minimal HTML, focus on markdown)
    return content
      .replace(this.MARKDOWN_PATTERNS.bold, '**$1**')
      .replace(this.MARKDOWN_PATTERNS.italic, '_$1_')
      .replace(this.MARKDOWN_PATTERNS.code, '`$1`')
      .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph spacing
      .trim();
  }
}
