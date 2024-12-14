// islands/FeatureHighlight.tsx
interface FeatureHighlightProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureHighlight({ title, description, icon }: FeatureHighlightProps) {
  return (
    <div class="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div class="text-4xl mb-4">
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
