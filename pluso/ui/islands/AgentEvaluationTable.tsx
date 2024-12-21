import { h } from "https://esm.sh/preact";
import { useSignal } from "https://esm.sh/@preact/signals";
import { useEffect } from "https://esm.sh/preact/hooks";

interface Evaluation {
  id: string;
  criteria: string;
  score: number;
  feedback?: string;
  created_at: string;
}

export default function AgentEvaluationTable() {
  const evaluations = useSignal<Evaluation[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch('/api/metrics/agent/82cbb039-8f91-413a-a9eb-82351c691000');
        const data = await response.json();
        evaluations.value = data.evaluations || [];
      } catch (err) {
        error.value = 'Failed to fetch evaluations';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    fetchEvaluations();
  }, []);

  if (loading.value) return <div>Loading evaluations...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  if (!evaluations.value.length) return <div>No evaluations available</div>;

  return (
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criteria
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Feedback
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {evaluations.value.map((evaluation) => (
            <tr key={evaluation.id}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(evaluation.created_at).toLocaleString()}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {evaluation.criteria}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {evaluation.score}%
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {evaluation.feedback || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
