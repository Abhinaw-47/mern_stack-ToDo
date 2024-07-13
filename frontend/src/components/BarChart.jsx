import React from 'react'
import { Bar } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto'

function BarChart(props) {
  return (
    <div>
        <Bar data={props.chartData} />
    </div>
  )
}

export default BarChart