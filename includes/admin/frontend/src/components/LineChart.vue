<template>
  <div>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title , CategoryScale } from 'chart.js';
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.chart.getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: this.data,
        options: this.options,
      });
    },
  },
};
</script>
