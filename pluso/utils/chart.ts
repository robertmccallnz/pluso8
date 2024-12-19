import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";

// Register all Chart.js components
Chart.register(...registerables);

export { Chart };
