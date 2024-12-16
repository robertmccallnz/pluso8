import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import { TemplateManager as TemplateManagerService, type PromptTemplate, type TemplateCategory } from "./IndustryTemplates";

interface TemplateManagerProps {
  industry?: string;
  onTemplateSelect: (template: PromptTemplate) => void;
}

interface TemplateFormData {
  name: string;
  description: string;
  category: TemplateCategory;
  prompt: string;
  responseTemplate: string;
  industry: string;
}

export function TemplateManager({ industry, onTemplateSelect }: TemplateManagerProps): JSX.Element {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const templateManager = TemplateManagerService.getInstance();

  useEffect(() => {
    loadTemplates();
  }, [industry, selectedCategory]);

  const loadTemplates = () => {
    let loadedTemplates: PromptTemplate[] = [];
    if (industry) {
      loadedTemplates = templateManager.getTemplatesByIndustry(industry);
    } else if (selectedCategory !== "all") {
      loadedTemplates = templateManager.getTemplatesByCategory(selectedCategory);
    } else {
      loadedTemplates = Object.values(templateManager.getTemplatesByCategory("custom"));
    }

    if (searchQuery) {
      loadedTemplates = loadedTemplates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setTemplates(loadedTemplates);
  };

  const handleSubmit = (formData: TemplateFormData) => {
    const template: PromptTemplate = {
      id: editingTemplate?.id || "",
      ...formData,
      isCustom: true,
    };

    if (editingTemplate) {
      templateManager.updateTemplate(template);
    } else {
      templateManager.saveTemplate(template);
    }

    setShowForm(false);
    setEditingTemplate(null);
    loadTemplates();
  };

  const handleDelete = (template: PromptTemplate) => {
    if (confirm("Are you sure you want to delete this template?")) {
      templateManager.deleteTemplate(template.id);
      loadTemplates();
    }
  };

  const categories: { value: TemplateCategory | "all"; label: string }[] = [
    { value: "all", label: "All Categories" },
    { value: "marketing", label: "Marketing" },
    { value: "operations", label: "Operations" },
    { value: "analysis", label: "Analysis" },
    { value: "documentation", label: "Documentation" },
    { value: "training", label: "Training" },
    { value: "customer-service", label: "Customer Service" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Template Management</h3>
        <button
          onClick={() => setShowForm(true)}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create Template
        </button>
      </div>

      <div class="space-y-4">
        <div class="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory((e.target as HTMLSelectElement).value as TemplateCategory | "all")
            }
            class="px-3 py-2 border rounded-md"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onInput={(e) => {
              setSearchQuery((e.target as HTMLInputElement).value);
              loadTemplates();
            }}
            class="flex-1 px-3 py-2 border rounded-md"
          />
        </div>

        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              class="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{template.name}</h4>
                  <p class="text-sm text-gray-600">{template.description}</p>
                </div>
                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {template.category}
                </span>
              </div>

              <div class="text-sm text-gray-500">
                Last updated: {new Date(template.updatedAt || "").toLocaleDateString()}
              </div>

              <div class="flex justify-between pt-2">
                <button
                  onClick={() => onTemplateSelect(template)}
                  class="text-blue-600 hover:text-blue-700"
                >
                  Use Template
                </button>
                <div class="space-x-2">
                  <button
                    onClick={() => {
                      setEditingTemplate(template);
                      setShowForm(true);
                    }}
                    class="text-gray-600 hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template)}
                    class="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 class="text-lg font-medium mb-4">
              {editingTemplate ? "Edit Template" : "Create Template"}
            </h3>
            <TemplateForm
              initialData={editingTemplate}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingTemplate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateFormProps {
  initialData?: PromptTemplate | null;
  onSubmit: (data: TemplateFormData) => void;
  onCancel: () => void;
}

function TemplateForm({ initialData, onSubmit, onCancel }: TemplateFormProps): JSX.Element {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "custom",
    prompt: initialData?.prompt || "",
    responseTemplate: initialData?.responseTemplate || "",
    industry: initialData?.industry || "",
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onInput={(e) =>
            setFormData({ ...formData, name: (e.target as HTMLInputElement).value })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onInput={(e) =>
            setFormData({
              ...formData,
              description: (e.target as HTMLTextAreaElement).value,
            })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md"
          rows={2}
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: (e.target as HTMLSelectElement).value as TemplateCategory,
            })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md"
          required
        >
          <option value="marketing">Marketing</option>
          <option value="operations">Operations</option>
          <option value="analysis">Analysis</option>
          <option value="documentation">Documentation</option>
          <option value="training">Training</option>
          <option value="customer-service">Customer Service</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Industry</label>
        <input
          type="text"
          value={formData.industry}
          onInput={(e) =>
            setFormData({ ...formData, industry: (e.target as HTMLInputElement).value })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Prompt Template</label>
        <textarea
          value={formData.prompt}
          onInput={(e) =>
            setFormData({ ...formData, prompt: (e.target as HTMLTextAreaElement).value })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows={4}
          required
          placeholder="Enter prompt template with {variables}"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          Response Template (Optional)
        </label>
        <textarea
          value={formData.responseTemplate}
          onInput={(e) =>
            setFormData({
              ...formData,
              responseTemplate: (e.target as HTMLTextAreaElement).value,
            })
          }
          class="mt-1 w-full px-3 py-2 border rounded-md font-mono text-sm"
          rows={6}
          placeholder="Enter response template with {variables}"
        />
      </div>

      <div class="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          class="px-4 py-2 text-gray-600 hover:text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? "Update Template" : "Create Template"}
        </button>
      </div>
    </form>
  );
}
