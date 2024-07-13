import React from 'react';
import { useCallback } from 'react';

function Table({ agingTodos }) {

    const firstSevenTodos = agingTodos.slice(0, 7);

    const formatDateInWords = useCallback(function (timestamp) {
        if (!timestamp || typeof timestamp !== 'string') {
          return '';
        }
      
        let date = new Date(timestamp);
        if (isNaN(date.getTime())) {
        
          return '';
        }
      
        let day = date.getDate();
        let year = date.getFullYear();
        let monthInWords = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
      
        let dayWithSuffix = day.toString();
      
        if (day == "1" || day == "21" || day == "31") {
          dayWithSuffix += "st";
        } else if (day == "2" || day == "22") {
          dayWithSuffix += "nd";
        } else if (day == "3" || day == "23") {
          dayWithSuffix += "rd";
        } else {
          dayWithSuffix += "th";
        }
      
        return `${dayWithSuffix} ${monthInWords}, ${year}`;
      }, []);

    return (
        <div className='shadow-[rgba(0,_0,_0,_0.3)_0px_10px_10px] font-display'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-900 ">
                    <thead className="text-xs text-gray-700 uppercase bg-blue-marguerite-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last Updated
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {firstSevenTodos.map((todo, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'even:bg-white' : 'odd:bg-gray-50 border-b'}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {todo.title}
                                </th>
                                <td className="px-6 py-4">
                                    {todo.inProgressAt ? formatDateInWords(todo.inProgressAt) : formatDateInWords(todo.createdAt)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
