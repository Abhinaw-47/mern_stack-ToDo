import React from 'react'
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'

function LineChart(props) {
  return (
    <div>
        <Line data={props.chartData} />
    </div>
  )
}

export default LineChart;