import { useState } from "react";
import plus from "../assets/plusSign.svg";
import cross from "../assets/cross.svg";
import { useCallback } from "react";
import axios from 'axios';
import backendUrl from "../global";

export function Sidebar(props) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showCross, setShowCross] = useState(false);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(null); // State to track selected project index

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const deleteProject = useCallback(async () => {    
        const safeToken = localStorage.getItem('token');
        if (safeToken) {
            try {
                props.setLoading(true);
                const response = await axios.delete(`${backendUrl}/project`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': safeToken,
                    },
                    data: { id: props.currentProject._id },
                });

                console.log(response.data);
                await props.fetchProjects();
                

                if (props.currentProject && props.currentProject._id === response.data.deletedProjectId) {

                    props.setCurrentProject(props.projectArray[0]);
                    setSelectedProjectIndex(0); 
                }
            } catch (e) {
                console.error("Error fetching Projects:", e);
            }
        }
    }, [props.currentProject, props.projectArray]);

    return (
        <aside
            id="sidebar-multi-level-sidebar"
            // className="top-0 left-0 z-40 font-display w-full h-screen transition-transform -translate-x-full sm:translate-x-0"
            className="top-0 left-0 z-40 font-display w-full h-screen"
            aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-200 flex flex-col justify-between">
                <div>
                <div className="h-36 rounded-xl bg-gray-300 hover:bg-blue-marguerite-200 flex flex-col cursor-pointer justify-center items-center" onClick={() => {
                    props.setSideBarVisible(false);
                    props.toggle();
                }}>
                    <img className="size-20" src={plus} alt="Add Project" />
                    <p className="text-sm text-gray-600">Add a project</p>
                </div>
                <ul className="space-y-2 font-medium border-t border-blue-marguerite-500 mt-4">
                    <li>
                        <button
                            type="button"
                            className="flex mt-2 items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-marguerite-100"
                            aria-controls="dropdown-example"
                            onClick={toggleDropdown}>
                            <svg
                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 18 21">
                                <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                            </svg>
                            
                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Projects</span>
                            <svg
                                className={`w-3 h-3 transform transition-transform ${
                                    showDropdown ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <ul
                            id="dropdown"
                            className={`py-2 space-y-2 ${showDropdown ? "" : "hidden"}`}>
                            {props.projectArray.map((element, index) => {
                                return(
                                    <li key={index}>
                                        <div
                                            className={`flex flex-row justify-between items-center cursor-pointer w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group ${selectedProjectIndex === index ? "bg-blue-marguerite-200"  : "hover:bg-blue-marguerite-100" }`}
                                            onClick={() => {
                                                props.setCurrentProject(element);
                                                setSelectedProjectIndex(index); // Update selected project index
                                                props.setToggleState(true);
                                                setShowCross(true);
                                            }}
                                        >
                                            {element.title}
                                            {selectedProjectIndex === index && (  // Conditionally render the cross icon
                                                <div className={`rounded-full ${showCross ? 'visible' : 'hidden' } size-6 flex justify-center items-center hover:bg-red-100`} onClick={() => {
                                                    deleteProject();
                                                }}>
                                                    <img className="size-4" src={cross} alt="deleteProject" />
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                </ul>
                </div>
                <div className="Signout">
                    <button
                        key={"signOut"}
                        type="button"
                        className="flex items-center w-full p-2 text-base text-white bg-gray-700 transition duration-75 rounded-lg group hover:bg-blue-marguerite-400"
                        onClick={props.signOut}
                        aria-controls="dropdown">
                        <svg
                            className="flex-shrink-0 w-5 h-5 text-white transition duration-75 group-hover:text-gray-900"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 21">
                            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                        </svg>
                        
                        <span className="flex-1 ms-3 text-left group-hover:text-gray-900 rtl:text-right whitespace-nowrap">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
