


import React from 'react'
import BarChart from './BarChart'
import { useState } from 'react'
import PieChart from './PieChart'
import { useEffect } from 'react'
import LineChart from './LineChart'
import Table from './Table'

function Dashboard(props) {
    const [averageCompletionTime, setAverageCompletionTime] = useState({ days: '-', hours: '-', mins: '-' });
    const [averageInProgressTime, setAverageInProgressTime] = useState({ days: '-', hours: '-', mins: '-' });
    const [agingTodos, setAgingTodos] = useState([]);

    function calculateAverageCompletionTime(projectData) {
        let totalCompletedTodos = 0;
        let totalTimeInMilliseconds = 0;
    
        projectData.forEach(todo => {
            if ((todo.status === 'Completed' && todo.completedAt) && (todo.completedAt !== todo.inProgressAt) && todo.inProgressAt) {
                const inProgressAt = new Date(todo.inProgressAt);
                const completedAt = new Date(todo.completedAt);
                const timeDifference = completedAt - inProgressAt; // Difference in milliseconds
    
                totalTimeInMilliseconds += timeDifference;
                totalCompletedTodos++;
            }
        });
    
        if (totalCompletedTodos === 0) {
            return { days: '-', hours: '-', mins: '-' }; // No completed todos, return 0 days and 0 hours
        }
    
        const averageTimeInMilliseconds = totalTimeInMilliseconds / totalCompletedTodos; // Average time in milliseconds
    
        const days = Math.floor(averageTimeInMilliseconds / (1000 * 60 * 60 * 24));
        const remainingHoursInMilliseconds = averageTimeInMilliseconds % (1000 * 60 * 60 * 24);
        const hours = Math.floor(remainingHoursInMilliseconds / (1000 * 60 * 60));
        const remainingMinsInMilliseconds = averageTimeInMilliseconds % (1000 * 60 * 60);
        const mins = Math.floor(remainingMinsInMilliseconds / (1000 * 60));
    
        return { days, hours, mins };
    }
    
    const incompleteTodoTime = (obj) => {
        let totalInProgressAt = 0;
        let totalTime = 0;
        
        const currentTime = Date.now();
    
        obj.forEach((todo) => {
            if ((todo.status === 'In Progress' && todo.inProgressAt)) {
                let inProgressAtTime = new Date(todo.inProgressAt).getTime();
                let timeDifference = currentTime - inProgressAtTime;
        
                totalTime += timeDifference;
                totalInProgressAt++;
            }
            
        });
    
        if (totalInProgressAt === 0) {
            return { days: '-', hours: '-', mins: '-' }; 
        }
    
        const averageTimeInMilliseconds = totalTime / totalInProgressAt; 
    
        const days = Math.floor(averageTimeInMilliseconds / (1000 * 60 * 60 * 24));
        const remainingHoursInMilliseconds = averageTimeInMilliseconds % (1000 * 60 * 60 * 24);
        const hours = Math.floor(remainingHoursInMilliseconds / (1000 * 60 * 60));
        const remainingMinutesInMilliseconds = remainingHoursInMilliseconds % (1000 * 60 * 60);
        const mins = Math.floor(remainingMinutesInMilliseconds / (1000 * 60));
    
        return { days, hours, mins };
    };

    function getAgingTodos(todos) {
        const currentDate = new Date(); 
    
       
        const agingTodos = todos.filter(todo => todo.status === 'In Progress' || todo.status === 'Yet to Start');
    
        
        agingTodos.sort((a, b) => {
            let aUpdatedAt;
            let bUpdatedAt;
    
            if (a.status === 'Yet to Start') {
                aUpdatedAt = new Date(a.createdAt);
            } else {
                aUpdatedAt = new Date(a.inProgressAt);
            }
    
            if (b.status === 'Yet to Start') {
                bUpdatedAt = new Date(b.createdAt);
            } else {
                bUpdatedAt = new Date(b.inProgressAt);
            }
    
            const diffA = currentDate - aUpdatedAt; 
            const diffB = currentDate - bUpdatedAt; 
    
            return diffB - diffA; 
        });
    
        return agingTodos;
    }

    

    useEffect(() => {
        const avgTime = calculateAverageCompletionTime(props.todos);
        setAverageCompletionTime(avgTime);
        
        const avgInProgTime = incompleteTodoTime(props.todos);
        setAverageInProgressTime(avgInProgTime);

        const aging = getAgingTodos(props.todos);
        // console.log("Aging: " + JSON.stringify(aging))
        setAgingTodos(aging);
    }, []);
      
    
    const getStatusData = (obj) => {
        let ans = {};
        
        for(let i = 0; i < obj.length; i++) {
            if(obj[i].status in ans){
                ans[obj[i].status] += 1;
            }
            else {
                ans[obj[i].status] = 1;
            }
        }
        return ans;
    }
    const statusData = getStatusData(props.todos);

    const [barData, setBarData] = useState({
        labels: Object.keys(statusData),
        datasets: [{
            label: "Tasks",
            data: Object.values(statusData),
            backgroundColor: Object.keys(statusData).map(status => {
                switch (status) {
                    case 'Completed':
                        return 'rgba(0, 128, 0, 0.5)'; 
                    case 'In Progress':
                        return 'rgba(255, 255, 0, 0.5)'; 
                    case 'Yet to Start':
                        return 'rgba(255, 0, 0, 0.5)'; 
                    default:
                        return 'rgba(169, 169, 169, 0.5)'; 
                }
            }),
            barThickness: '50'
        }],
    });

    
    

   
    function calculateLast4WeeksForwardTransitions(data) {
       
        const weeklyForwardTransitions = {};
        
      
        const currentDate = new Date();
        
    
        for (let i = 0; i < 4; i++) {
           
            const weekStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() - (7 * i));
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6); 
            

            const weekKey = weekStartDate.toISOString().split('T')[0];
            

            weeklyForwardTransitions[weekKey] = {
                totalTransitions: 0,
                count: 0
            };
            

            data.forEach(todo => {
                const createdAt = new Date(todo.createdAt);
                const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
                const inProgressAt = todo.inProgressAt ? new Date(todo.inProgressAt) : null;
                
                if (completedAt && completedAt >= weekStartDate && completedAt <= weekEndDate) {
                    weeklyForwardTransitions[weekKey].totalTransitions++;
                    weeklyForwardTransitions[weekKey].count++;
                } else if (inProgressAt && inProgressAt >= weekStartDate && inProgressAt <= weekEndDate && !completedAt) {
                    weeklyForwardTransitions[weekKey].totalTransitions++;
                    weeklyForwardTransitions[weekKey].count++;
                }
            });
            

            if (weeklyForwardTransitions[weekKey].count > 0) {
                weeklyForwardTransitions[weekKey].averageTransitions =
                    weeklyForwardTransitions[weekKey].totalTransitions / weeklyForwardTransitions[weekKey].count;
            } else {
                weeklyForwardTransitions[weekKey].averageTransitions = 0;
            }
        }
        
        return weeklyForwardTransitions;
    }

    
    const last4WeeksForwardTransitions = calculateLast4WeeksForwardTransitions(props.todos);

    const lineChartData = {
        labels: Object.keys(last4WeeksForwardTransitions).reverse(), 
        datasets: [{
            label: 'Average Forward Transitions',
            data: Object.values(last4WeeksForwardTransitions).map(week => week.averageTransitions).reverse(), // Reverse the order of average transitions
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    
          
    return (
        <div className='bg-gray-50 h-full mt-4 mx-8 rounded-2xl px-8 shadow-[rgba(0,_0,_0,_0.3)_0px_30px_90px] font-display flex flex-col sm:flex-row overflow-hidden'>
            <div className='h-full py-8 sm:w-1/3'>
                <div className='p-2 rounded-xl flex flex-col'>
                    <div className='h-2/5 p-3 flex flex-row justify-between'>
                        <p className='font-semibold text-lg'>Status Distribution</p>
                        <div className='pt-1'>
                            <svg className="h-6 w-6 text-blue-marguerite-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </div>
                    </div>
                    <div className='flex flex-col h-3/5'>
                        <PieChart data={barData} />
                    </div>
                </div>
            </div>
            <div className='h-full sm:h-3/4 grid grid-cols-2 sm:w-1/3'>
                <div className='col-span-2 grid grid-cols-2 gap-4 p-4'>
                    <div className='col-span-1 p-2 bg-jade-200/70 rounded-xl flex flex-col shadow-[rgba(0,_0,_0,_0.3)_0px_10px_10px]'>
                        <div className='h-3/5 flex flex-row justify-between'>
                            <p className='font-semibold text-sm sm:text-md'>Average Completion Time</p>
                            <div className='pt-1'>
                                <svg className="h-6 w-6 text-blue-marguerite-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                        </div>
                        <div className='flex flex-col h-3/5 justify-center items-center'>
                            <p className='font-bold text-xl sm:text-3xl'>{`${averageCompletionTime.days}d ${averageCompletionTime.hours}h ${averageCompletionTime.mins}m`}</p>
                        </div>
                    </div>
                    <div className='col-span-1 p-2 rounded-xl bg-yellow-100 shadow-[rgba(0,_0,_0,_0.3)_0px_10px_10px]'>
                        <div className='h-3/5 flex flex-row justify-between'>
                            <p className='font-semibold text-sm sm:text-md'>Average Time on Incomplete To-do's</p>
                            <div className='pt-1'>
                                <svg className="h-6 w-6 text-blue-marguerite-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                        </div>
                        <div className='flex flex-col h-3/5 justify-center items-center'>
                            <p className='font-bold text-xl sm:text-3xl'>{`${averageInProgressTime.days}d ${averageInProgressTime.hours}h ${averageInProgressTime.mins}m`}</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-2'>
                    <div className='p-2 rounded-xl flex flex-col my-12 justify-center'>
                        <div className='h-2/5 p-3 flex flex-row justify-between'>
                            <p className='font-semibold text-lg'>Forward Trend Analysis</p>
                            <div className='pt-1'>
                                <svg className="h-6 w-6 text-blue-marguerite-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                        </div>
                        <div className='flex flex-col h-3/5'>
                            <LineChart chartData={lineChartData} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-full col-span-1 py-8 sm:w-1/3'>
                <div className='p-2 rounded-xl flex flex-col'>
                    <div className='h-2/5 p-3 flex flex-row justify-between'>
                        <p className='font-semibold text-lg'>Aging To-do's</p>
                        <div className='pt-1'>
                            <svg className="h-6 w-6 text-blue-marguerite-400"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  stroke-linecap="round"  strokeLinejoin="round">  <circle cx="12" cy="12" r="10" />  <line x1="12" y1="16" x2="12" y2="12" />  <line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        </div>
                    </div>
                    <div className='flex flex-col pt-2 h-3/5'>
                        <Table agingTodos={agingTodos} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard