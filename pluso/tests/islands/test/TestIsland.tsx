import { signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function TestIsland() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  const countSignal = signal(0);

  return (
    <div>
      <p data-testid="count">{countSignal.value}</p>
      <button 
        data-testid="increment"
        onClick={() => countSignal.value = countSignal.value + 1}
      >
        Increment
      </button>
    </div>
  );
}
