import { useState, useCallback } from "react";
import axios from "axios";
import Todo from "./Todo";
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ToDoModal from "./ToDoModal";
import { useEffect } from "react";
import Dashboard from "./Dashboard";
import backendUrl from "../global";

export function ProjectHome(props) {
    const [todos, setTodos] = useState([]);
    const [toDoModal, setToDoModal] = useState(false);
    const [toDoTitle, setToDoTitle] = useState(""); 
    const [toDoDescription, setToDoDescription] = useState("") 
    const [yetToStartTodo, setYetToStartTodo] = useState([]);
    const [inProgressTodo, setInProgressTodo] = useState([]);
    const [completedTodo, setCompletedTodo] = useState([]);
    const [todosLoading, setTodosLoading] = useState(false);
    
    const toggleToDoModal = useCallback(() => {
        setToDoModal(!toDoModal);
    }, [toDoModal]);

    

    const fetchTodo = useCallback(async () => {    
        const safeToken = localStorage.getItem('token');

    
        try {
            setTodosLoading(true);
            const response = await axios.get(`${backendUrl}/todos`, {
                params: {
                    projectId: props.currentProject._id,
                },
                headers: {
                    "Authorization": safeToken,
                }
            });

            console.log(response.data.todos);
            setTodos(response.data.todos);
            setTodosLoading(false);
        } catch(e) {
            console.error("Error fetching Todos:", e);
        }
    }, [props.currentProject, toDoModal]);

    const addTodo = useCallback(async () => {

        try {
            let safeToken = localStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/todo`, {
                title: toDoTitle,
                description: toDoDescription,
                projectId: props.currentProject._id,
            }, {
                headers: {
                    "Authorization": `${safeToken}`
                }
            });

            alert("Todo Created");
            setToDoTitle("");
            setToDoModal(false);
        } catch(e) {
            console.error("Error adding ToDo:", e);
        }
    }, [fetchTodo, props.currentProject, toDoDescription, toDoTitle]);


    useEffect(() => {
        fetchTodo();
    }, [props.currentProject, toDoModal, props.toggleState]);

    useEffect(() => {
        const ytsTodos = todos.filter((todo) => {
            return todo.status === "Yet to Start";
        });
        console.log(ytsTodos);
        
        const ipTodos = todos.filter((todo) => {
            return todo.status === "In Progress";
        });
        
        const cTodos = todos.filter((todo) => {
            return todo.status === "Completed";
        });

        setYetToStartTodo(ytsTodos);
        setInProgressTodo(ipTodos);
        setCompletedTodo(cTodos);
    }, [todos, props.currentProject, props.toggleState]);
    
    const columnMapping = {
        "yetToStart": "Yet to Start",
        "inProgress": "In Progress",
        "completed": "Completed"
    }

    const updateTodoStatus = async (id, status) => {
        try {
            let safeToken = localStorage.getItem('token');
            const response = await axios.put(`${backendUrl}/updateStatus`, {
                id: id,
                status: status
            }, {
                headers: {
                    "Authorization": `${safeToken}`
                }
            });

        } catch (error) {
            console.error("Error updating todo status:", error);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
    
        if (!destination) {
            return;
        }
    
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
    
        
        let sourceColumn, destinationColumn;
        if (source.droppableId === 'yetToStart') {
            sourceColumn = yetToStartTodo;
        } else if (source.droppableId === 'inProgress') {
            sourceColumn = inProgressTodo;
        } else if (source.droppableId === 'completed') {
            sourceColumn = completedTodo;
        }
    
        if (destination.droppableId === 'yetToStart') {
            destinationColumn = yetToStartTodo;
        } else if (destination.droppableId === 'inProgress') {
            destinationColumn = inProgressTodo;
        } else if (destination.droppableId === 'completed') {
            destinationColumn = completedTodo;
        }
    
        const draggedItem = sourceColumn.find(todo => todo._id === draggableId);
        const newSourceColumn = sourceColumn.filter(todo => todo._id !== draggableId);
    
        if (source.droppableId === destination.droppableId) {
            const reorderedItems = Array.from(sourceColumn);
            const [removedItem] = reorderedItems.splice(source.index, 1);
            reorderedItems.splice(destination.index, 0, removedItem);
    
            if (source.droppableId === 'yetToStart') {
                setYetToStartTodo(reorderedItems);
            } else if (source.droppableId === 'inProgress') {
                setInProgressTodo(reorderedItems);
            } else if (source.droppableId === 'completed') {
                setCompletedTodo(reorderedItems);
            }
        } else {
           
            const newDestinationColumn = Array.from(destinationColumn);
            newDestinationColumn.splice(destination.index, 0, draggedItem);
            if (source.droppableId === 'yetToStart') {
                setYetToStartTodo([...newSourceColumn]);
                setInProgressTodo([...newDestinationColumn]);
                setCompletedTodo([...newDestinationColumn]);
            } else if (source.droppableId === 'inProgress') {
                setYetToStartTodo([...newDestinationColumn]);
                setInProgressTodo([...newSourceColumn]);
                setCompletedTodo([...newDestinationColumn]);
            } else if (source.droppableId === 'completed') {
                setYetToStartTodo([...newDestinationColumn]);
                setInProgressTodo([...newDestinationColumn]);
                setCompletedTodo([...newSourceColumn]);
            }
          
            setTodosLoading(true);
        
         
            await updateTodoStatus(draggedItem._id, columnMapping[destination.droppableId]);
        
         
            await fetchTodo();

            props.setUpdated(true);
        
            setTodosLoading(false);
        }
    };

    const calculateProgress = () => {
        const totalTodos = todos.length;
        const completedTodos = completedTodo.length;
        const progress = Math.round((completedTodos / totalTodos) * 100);
        return isNaN(progress) ? 0 : progress;
    }

    return (
        <div className="h-full opacity-90 font-display grid grid-rows-[max-content_max-content_1fr]">
            <ToDoModal 
                setToDoTitle={setToDoTitle} 
                toDoTitle={toDoTitle} 
                toDoModal={toDoModal} 
                setToDoModal={setToDoModal} 
                setToDoDescription={setToDoDescription} 
                toDoDescription={toDoDescription}
                toggle={toggleToDoModal}
                addTodo={addTodo}
            />
            <div className="w-full px-2 sm:px-16 py-8 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-0">{props.currentProject.title}</p>
                <div className="flex justify-between">
                    <div className="inline-flex sm:items-center p-2 rounded-lg cursor-pointer dark:text-gray-800" onClick={() => {
                        props.toggleComponent()
                        }}>
                        <span
                            className={`px-4 py-2 rounded-l-lg ${
                                props.toggleState ? 'bg-blue-marguerite-300 peer-checked:bg-gray-300' : 'bg-gray-300 peer-checked:bg-blue-marguerite-300'
                            } transition-colors duration-300`}
                        >
                            Tasks
                        </span>
                        <span
                            className={`px-4 py-2 rounded-r-lg ${
                                props.toggleState ? 'bg-gray-300 peer-checked:bg-blue-marguerite-300' : 'bg-blue-marguerite-300 peer-checked:bg-gray-300'
                            } transition-colors duration-300`}
                        >
                            Dashboard
                        </span>

                    </div>
                <Button label="Add To-do" toggle={toggleToDoModal} />
                </div>
            </div>

            <div className="px-4 sm:px-16 flex flex-col">
                <p className="font-lg font-semibold mb-2">Progress: </p>
                <div className="w-full bg-gray-200 rounded-full">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-85 group-hover:opacity-100 transition duration-1000 text-center group-hover:duration-200 text-white" style={{ width: `${calculateProgress()}%` }}>{`${calculateProgress()}%`}</div>
                </div>
            </div>
            {props.toggleState ? <div className="h-full overflow-hidden">            
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="px-4 sm:px-16 mt-2 grid grid-cols-[repeat(3,minmax(320px,1fr))] gap-4 py-3 h-full overflow-x-auto">
                    <div className="cols-span-1 bg-red-200 rounded-xl overflow-auto red-scrollbar">
                        <div className="flex justify-center items-center h-8 border-b-2 border-blue-marguerite-300 font-bold">
                            Yet to Start
                        </div>
                        {todosLoading ? <div className="h-full w-full flex justify-center items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -50 800 800"><rect fill="#FF0F53" stroke="#FF0F53" strokeWidth="3" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#FF0F53" stroke="#FF0F53" strokeWidth="3" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#FF0F53" stroke="#FF0F53" strokeWidth="3" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
                                        </div> : <Droppable droppableId="yetToStart">
                                                            {(provided) => (
                                                                <div className="flex flex-col p-4 justify-center items-center w-full" ref={provided.innerRef} {...provided.droppableProps}>
                                                                    {yetToStartTodo.map((todo, index) => (
                                                                        todo.status == "Yet to Start" ? <Todo key={todo._id} fetchTodo={fetchTodo} setTodosLoading={setTodosLoading} currentProject={props.currentProject} id={todo._id} title={todo.title} description={todo.description} index={index} /> : ""
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>}
                        
                    </div>
                    <div className="cols-span-1 bg-yellow-200 rounded-xl overflow-auto yellow-scrollbar">
                        <div className="flex justify-center items-center h-8 border-b-2 border-blue-marguerite-300 font-bold">
                            In Progress
                        </div>
                        {todosLoading ? <div className="h-full w-full flex justify-center items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -50 800 800"><rect fill="#FFCD0B" stroke="#FFCD0B" strokeWidth="3" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#FFCD0B" stroke="#FFCD0B" strokeWidth="3" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#FFCD0B" stroke="#FFCD0B" strokeWidth="3" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
                                        </div> : <Droppable droppableId="inProgress">
                                                            {(provided) => (
                                                                <div className="flex flex-col p-4 justify-center items-center w-full" ref={provided.innerRef} {...provided.droppableProps}>
                                                                    {inProgressTodo.map((todo, index) => (
                                                                        todo.status == "In Progress" ? <Todo key={todo._id} fetchTodo={fetchTodo} setTodosLoading={setTodosLoading} currentProject={props.currentProject} id={todo._id} title={todo.title} description={todo.description} index={index} /> : ""
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>}
                        
                    </div>
                    <div className="cols-span-1 bg-green-200 rounded-xl overflow-auto green-scrollbar">
                        <div className="flex justify-center items-center h-8 border-b-2 border-blue-marguerite-300 font-bold">
                            Completed
                        </div>
                        {todosLoading ? <div className="h-full w-full flex justify-center items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -50 800 800"><rect fill="#06FF36" stroke="#06FF36" strokeWidth="3" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#06FF36" stroke="#06FF36" strokeWidth="3" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#06FF36" stroke="#06FF36" strokeWidth="3" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="1.8" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
                                        </div> : <Droppable droppableId="completed">
                                                            {(provided) => (
                                                                <div className="flex flex-col p-4 justify-center items-center w-full" ref={provided.innerRef} {...provided.droppableProps}>
                                                                    {completedTodo.map((todo, index) => (
                                                                        todo.status == "Completed" ? <Todo key={todo._id} fetchTodo={fetchTodo} setTodosLoading={setTodosLoading} currentProject={props.currentProject} id={todo._id} title={todo.title} description={todo.description} index={index} /> : ""
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>}
                        
                    </div>
                </div>
            </DragDropContext>
            </div> : <Dashboard todos={todos} />}
            
        </div>
    );
}

function Button(props) {
    return (
        <button 
            className="cursor-pointer bg-blue-marguerite-100 sm:bg-transparent font-display relative inline-flex items-center pl-6 pr-6 sm:pr-12 sm:pl-10 py-3 overflow-hidden text-sm sm:text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
            onClick={props.toggle}
        >
            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
            <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                <svg className="w-5 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            <span className="relative">{props.label}</span>
        </button>
    );
}
