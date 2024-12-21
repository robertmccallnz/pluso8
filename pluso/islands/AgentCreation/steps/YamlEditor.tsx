import { useSignal } from "@preact/signals";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { AgentConfig } from "../types.ts";
import { validateYaml, formatYaml, YamlValidationResult } from "../utils/yamlValidator.ts";
import _ from "npm:lodash@4.17.21";
import Prism from "npm:prismjs@1.29.0";
import "npm:prismjs@1.29.0/components/prism-yaml.js";

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const YamlEditor = ({ config, onUpdate }: Props) => {
  const yamlContent = useSignal("");
  const error = useSignal<string | null>(null);
  const loading = useSignal(true);
  const validation = useSignal<YamlValidationResult>({
    isValid: true,
    errors: [],
    parsedYaml: null,
  });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLPreElement>(null);
  const scrollRef = useRef<number>(0);

  // Debounced validation and highlighting
  const validateAndHighlight = useCallback(
    _.debounce((content: string) => {
      validation.value = validateYaml(content);
      if (previewRef.current) {
        previewRef.current.innerHTML = Prism.highlight(
          content,
          Prism.languages.yaml,
          "yaml"
        );
      }
    }, 300),
    []
  );

  // Sync scroll between editor and preview
  const handleScroll = useCallback((event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    const { scrollTop, scrollHeight } = textarea;
    scrollRef.current = scrollTop;
    
    if (previewRef.current) {
      const percentage = scrollTop / scrollHeight;
      const previewScrollHeight = previewRef.current.scrollHeight;
      previewRef.current.scrollTop = percentage * previewScrollHeight;
    }
  }, []);

  // Load template based on selected type
  useEffect(() => {
    if (!config.yaml) return;

    const loadTemplate = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await fetch(`/static/templates/${config.yaml}`);
        if (!response.ok) throw new Error("Failed to load template");
        const content = await response.text();
        const formattedContent = formatYaml(content);
        yamlContent.value = formattedContent;
        onUpdate({ yaml: formattedContent });
        validateAndHighlight(formattedContent);
      } catch (err) {
        error.value = err.message;
        yamlContent.value = "";
      } finally {
        loading.value = false;
      }
    };

    loadTemplate();
  }, [config.yaml]);

  const handleYamlChange = useCallback((event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    yamlContent.value = target.value;
    onUpdate({ yaml: target.value });
    validateAndHighlight(target.value);
  }, [onUpdate]);

  const handleFormat = useCallback(() => {
    const formatted = formatYaml(yamlContent.value);
    yamlContent.value = formatted;
    onUpdate({ yaml: formatted });
    validateAndHighlight(formatted);
  }, []);

  if (loading.value) {
    return (
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="text-center text-red-600 p-4">
        <p>Error loading template: {error.value}</p>
        <button
          onClick={() => window.location.reload()}
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div class="flex flex-col space-y-4">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">YAML Configuration</h3>
        <p class="text-gray-600">
          This YAML file defines your agent's capabilities, behavior, and integration points.
          Edit it to customize your agent's functionality.
        </p>
      </div>

      {/* Validation Status */}
      {!validation.value.isValid && (
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <h4 class="text-red-800 font-medium mb-2">Validation Errors:</h4>
          <ul class="list-disc list-inside text-red-700 space-y-1">
            {validation.value.errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor Container */}
      <div class="flex-1 relative h-[600px] rounded-lg overflow-hidden">
        {/* Hidden textarea for editing */}
        <textarea
          ref={editorRef}
          value={yamlContent.value}
          onInput={handleYamlChange}
          onScroll={handleScroll}
          class={`
            absolute inset-0 w-full h-full p-4
            font-mono text-sm bg-transparent
            border-2 rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-200
            transition-colors duration-200 z-10
            ${validation.value.isValid 
              ? "border-green-200 focus:border-green-500" 
              : "border-red-200 focus:border-red-500"
            }
          `}
          spellcheck={false}
          placeholder="Loading YAML template..."
        />
        
        {/* Syntax highlighted preview */}
        <pre
          ref={previewRef}
          class="
            absolute inset-0 w-full h-full p-4
            font-mono text-sm bg-gray-900
            overflow-auto pointer-events-none
            whitespace-pre-wrap break-words
          "
          aria-hidden="true"
        />
      </div>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <div>
          Lines: {yamlContent.value.split("\n").length}
          {" | "}
          Characters: {yamlContent.value.length}
          {" | "}
          Status: {validation.value.isValid ? "Valid" : "Invalid"}
        </div>
        <div>
          Mode: {config.mode}
          {" | "}
          Industry: {config.industry}
          {" | "}
          Type: {config.type}
        </div>
      </div>

      <div class="flex space-x-4">
        <button
          onClick={() => window.location.reload()}
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Reset to Template
        </button>
        <button
          onClick={handleFormat}
          class="px-4 py-2 text-blue-600 hover:text-blue-800"
        >
          Format YAML
        </button>
      </div>
    </div>
  );
};

export default YamlEditor;
