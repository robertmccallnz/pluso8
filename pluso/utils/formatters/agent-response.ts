// utils/formatters/agent-response.ts

interface FormatOptions {
  formatCode?: boolean;
  formatLinks?: boolean;
  formatMaori?: boolean;
  formatLists?: boolean;
  addTimestamp?: boolean;
}

interface CodeBlock {
  language: string;
  code: string;
}

export class AgentResponseFormatter {
  private static readonly MAORI_WORDS_REGEX = /\b[A-Z][a-zāēīōū]+\b/g;
  private static readonly CODE_BLOCK_REGEX = /```(\w+)?\n([\s\S]*?)```/g;
  private static readonly LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
  private static readonly LIST_ITEM_REGEX = /^[-*]\s(.+)$/gm;

  static format(response: string, options: FormatOptions = {}): string {
    let formatted = response;

    if (options.formatCode) {
      formatted = this.formatCodeBlocks(formatted);
    }

    if (options.formatLinks) {
      formatted = this.formatLinks(formatted);
    }

    if (options.formatMaori) {
      formatted = this.formatMaoriWords(formatted);
    }

    if (options.formatLists) {
      formatted = this.formatLists(formatted);
    }

    if (options.addTimestamp) {
      formatted = this.addTimestamp(formatted);
    }

    return formatted;
  }

  private static formatCodeBlocks(text: string): string {
    const codeBlocks: CodeBlock[] = [];
    let index = 0;

    // Extract and store code blocks
    const withPlaceholders = text.replace(this.CODE_BLOCK_REGEX, (match, language, code) => {
      const placeholder = `__CODE_BLOCK_${index}__`;
      codeBlocks.push({ language: language || 'text', code: code.trim() });
      index++;
      return placeholder;
    });

    // Replace placeholders with formatted code blocks
    let formatted = withPlaceholders;
    codeBlocks.forEach((block, i) => {
      formatted = formatted.replace(
        `__CODE_BLOCK_${i}__`,
        `\n<pre class="language-${block.language}">\n${block.code}\n</pre>\n`
      );
    });

    return formatted;
  }

  private static formatLinks(text: string): string {
    return text.replace(
      this.LINK_REGEX,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  private static formatMaoriWords(text: string): string {
    return text.replace(this.MAORI_WORDS_REGEX, (match) => 
      `<span class="font-maori text-emerald-700" title="Māori word">${match}</span>`
    );
  }

  private static formatLists(text: string): string {
    const listItems = text.match(this.LIST_ITEM_REGEX);
    if (!listItems) return text;

    let inList = false;
    return text.split('\n').map(line => {
      const isListItem = line.match(/^[-*]\s/);
      
      if (isListItem && !inList) {
        inList = true;
        return '<ul class="list-disc pl-6 space-y-2">\n' + 
               `  <li>${line.replace(/^[-*]\s/, '')}</li>`;
      } else if (isListItem) {
        return `  <li>${line.replace(/^[-*]\s/, '')}</li>`;
      } else if (!isListItem && inList) {
        inList = false;
        return '</ul>\n' + line;
      }
      return line;
    }).join('\n');
  }

  private static addTimestamp(text: string): string {
    const timestamp = new Date().toLocaleString('en-NZ', {
      timeZone: 'Pacific/Auckland',
      hour12: true,
      hour: 'numeric',
      minute: 'numeric'
    });
    return `${text}\n\n<span class="text-gray-500 text-sm">${timestamp}</span>`;
  }
}

// Example usage:
// const formatted = AgentResponseFormatter.format(response, {
//   formatCode: true,
//   formatLinks: true,
//   formatMaori: true,
//   formatLists: true,
//   addTimestamp: true
// });
