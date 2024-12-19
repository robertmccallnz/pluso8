// islands/FeatureHighlight.tsx
import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";

interface FeatureHighlightProps {
  title: string;
  description: string;
  icon: string;
}

// Animation state signal
const isHovered = signal(false);

export default function FeatureHighlight({ title, description, icon }: FeatureHighlightProps) {
  if (!IS_BROWSER) {
    return (
      <div class="p-6 bg-white rounded-lg shadow-lg">
        <div class="text-4xl mb-4">{icon}</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p class="text-gray-600">{description}</p>
      </div>
    );
  }

  return (
    <div
      class={`
        p-6 bg-white rounded-lg shadow-lg transition-all duration-300
        ${isHovered.value ? 'transform -translate-y-1 shadow-xl' : ''}
      `}
      onMouseEnter={() => isHovered.value = true}
      onMouseLeave={() => isHovered.value = false}
    >
      <div class={`
        text-4xl mb-4 transition-transform duration-300
        ${isHovered.value ? 'transform scale-110' : ''}
      `}>
        {icon}
      </div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p class="text-gray-600">
        {description}
      </p>
    </div>
  );
}
