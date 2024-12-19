import { signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function TestSignals() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  const textSignal = signal("");

  return (
    <div>
      <input
        data-testid="input"
        value={textSignal.value}
        onInput={(e) => textSignal.value = (e.target as HTMLInputElement).value}
      />
      <p data-testid="display">{textSignal.value}</p>
    </div>
  );
}
