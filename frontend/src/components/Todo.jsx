import React from 'react'
import { Draggable } from '@hello-pangea/dnd';
import cross from '../assets/cross.svg';
import { useCallback } from 'react';
import axios from 'axios';
import backendUrl from "../global";

function Todo(props) {

  const deleteTodo = useCallback(async () => {    
    const safeToken = localStorage.getItem('token');
    // console.log(safeToken);

    if (safeToken) {
        try {
            props.setTodosLoading(true);
            const response = await axios.delete(`${backendUrl}/todo`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': safeToken,
                },
                data: { id: props.id },
            });

            console.log(response.data);
            // props.setTodosLoading(false);
            props.fetchTodo();
        } catch (e) {
            console.error("Error fetching Todos:", e);
        }
    }
}, [props.currentProject]);


  const id = props.id.toString();
  return (
    <Draggable draggableId={id} index={props.index}>
      {(provided) => (
        <div className='m-2 p-6 flex font-display flex-row justify-between bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 w-4/5' 
          {...provided.draggableProps} 
          {...provided.dragHandleProps} 
          ref={provided.innerRef}
        >
          <div className='flex flex-col'>
            <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">{props.title}</h5>
            <p className="font-normal text-gray-600">{props.description}</p>
          </div>
          
          <div className={`rounded-full size-6 flex justify-center items-center hover:bg-red-100 cursor-default`} onClick={() => {
            deleteTodo();
          }}>
              <img className="size-4" src={cross} alt="deleteTodo" />
          </div>
        </div>
      )}   
    </Draggable>
  )
}

export default Todo
