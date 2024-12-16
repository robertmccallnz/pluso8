import { Chart, registerables } from "https://esm.sh/chart.js@4.4.1";
import "https://esm.sh/chartjs-adapter-date-fns@3.0.0";

// Register all built-in components
Chart.register(...registerables);

// Configure defaults
Chart.defaults.font.family = 'system-ui, sans-serif';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

export { Chart };
