import React from 'react'
import { Doughnut } from 'react-chartjs-2';

function PieChart(props) {
  return (
    <div>
        <Doughnut data={props.data} />
    </div>
  )
}

export default PieChart