import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";

const DoughnutChart = ({ data, options }) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    ChartJS.register({
        id: 'doughnutCenterText',
        beforeDraw: (chart) => {
            const { ctx, chartArea } = chart;
            const text = options.plugins.doughnutCenterText.text;
            const font = options.plugins.doughnutCenterText.font;
            const color = options.plugins.doughnutCenterText.color;

            ctx.save();
            ctx.font = `${font.weight} ${font.size}px Arial`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.fillText(text, centerX, centerY);

            ctx.restore();
        },
    });

    return (
        <div style={{ width: '110px', height: '110px' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;
