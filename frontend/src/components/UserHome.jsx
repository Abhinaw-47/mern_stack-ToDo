import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { ProjectHome } from "./ProjectHome";
import { Sidebar } from "./Sidebar";
import bgImg from "../assets/ooorganize.svg";
import ProjectModal from "./ProjectModal";
import { useNavigate } from 'react-router-dom';
import backendUrl from "../global";

export function UserHome() {
    const [name, setName] = useState("User");
    const [loading, setLoading] = useState(true);
    const [numberOfProjects, setNumberOfProjects] = useState(0);
    const [projectArray, setProjectArray] = useState([]);
    const [modal, setModal] = useState(false); 
    
    const [projectTitle, setProjectTitle] = useState(""); 
    const [currentProject, setCurrentProject] = useState(null);

    const [updated, setUpdated] = useState(false);
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [toggleState, setToggleState] = useState(true);

    
    const toggleComponent = useCallback(() => {
        setToggleState(!toggleState);
    }, [toggleState]);

    const navigate = useNavigate();

    const toggleModal = () => {
        setModal(!modal);
    }

    const fetchName = useCallback(async () => {
        const safeToken = localStorage.getItem('token');
        // console.log(safeToken);
        if(safeToken) {
            const response = await axios.get(`${backendUrl}/name`, {
                headers: {
                    "Authorization": `${safeToken}`,
                }
            });
            // console.log(response.data.name);
            let name = response.data.name.toString();
            let firstName = name.split(" ")[0];
            // console.log(firstName);
            setName(firstName);
        } else {
            navigate("/signin");
        }
    });

    const fetchProjects = useCallback(async () => {
        // console.log("On fetching projects, value of projectTitle: " + projectTitle);
        try {
            const safeToken = localStorage.getItem('token');
            if(safeToken) {
                const response = await axios.get(`${backendUrl}/projects`, {
                    headers: {
                        "Authorization": `${safeToken}`,
                    }
                });
                // console.log(response.data);
                setProjectArray(response.data["allProjects"]);
                setNumberOfProjects(response.data.allProjects.length);
                setLoading(false);
            } else {
                navigate("/signin");
            }
            
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProjects();
        fetchName();
    }, []);

    const addProject = useCallback(async () => {
        console.log("Backend call for adding project...");
        console.log("Project Title: " + projectTitle);
        try {
            let safeToken = localStorage.getItem('token');
            const response = await axios.post(`${backendUrl}/project`, {
                title: projectTitle,
            }, 
            {
                headers: {
                    "Authorization": `${safeToken}`
                }
            });
    
            // console.log(response);
            alert("Project Created");
            setProjectTitle("");
            setModal(false);
    
           
            fetchProjects();
        } catch(e) {
            console.error("Error adding project:", e);
        }
    }, [projectTitle, fetchProjects, setProjectTitle, setModal]);

    const signOut = () => {

        localStorage.removeItem('token');
    
        navigate("/signin"); 
    }

    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)


    const minSwipeDistance = 60

    const onTouchStart = (e) => {
    setTouchEnd(null) 
    setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
        setSideBarVisible(false);
    } else if(isRightSwipe) {
        setSideBarVisible(true);
    }
}
    
    
    return(
        <div className="w-full min-h-screen font-display flex flex-row sm:flex-col sm:overflow-y-hidden">
            <div className="grid grid-cols-6 min-h-screen" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <div className={sideBarVisible ? "col-span-5 trasition sm:col-span-1 shadow-[rgba(0,_0,_0,_0.4)_0px_10px_90px]" : "hidden sm:block sm:col-span-2 lg:col-span-1 sm:shadow-[rgba(0,_0,_0,_0.4)_0px_10px_90px]"}>
                    <Sidebar projectArray={projectArray} 
                            toggle={toggleModal}
                            currentProject={currentProject}
                            setCurrentProject={setCurrentProject}
                            signOut={signOut}
                            toggleState={toggleState}
                            setToggleState={setToggleState}
                            toggleComponent={toggleComponent}
                            fetchProjects={fetchProjects}
                            setLoading={setLoading}
                            loading={loading}
                            setSideBarVisible={setSideBarVisible}
                        />
                </div>
               
                <div className={sideBarVisible ? "col-span-1 sm:col-span-5 relative z-10 mx-24 sm:mx-0" : "col-span-6 sm:col-span-4 lg:col-span-5 relative z-10"}>
                {loading ? (
                        <div className="w-full flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1500 -800 3000 3000">
                                <circle fill="#6177FF" stroke="#6177FF" strokeWidth="5" r="15" cx="40" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                                </circle>
                                <circle fill="#6177FF" stroke="#6177FF" strokeWidth="5" r="15" cx="100" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                                </circle>
                                <circle fill="#6177FF" stroke="#6177FF" strokeWidth="5" r="15" cx="160" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                                </circle>
                            </svg>
                        </div>
                    ) : numberOfProjects === 0 ? (
                        <div>
                            <BgImage opacity="0.05" />
                            <ProjectModal toggle={toggleModal} modal={modal} projectTitle={projectTitle} setProjectTitle={setProjectTitle} addProject={addProject} />
                            <div className="z-10">
                                <Waves />
                                <div className="w-full px-8 sm:px-16 py-16 sm:py-8 text-5xl sm:text-6xl font-bold mb-16">
                                    Hi<span className="text-blue-marguerite-400">, </span> {name}
                                </div>
                                <div className="w-full flex flex-col items-center justify-center text-center px-8 sm:px-16 py-32">
                                    <p className="text-gray-700 my-8 font-semibold text-xl">You don't have any active projects at the moment!</p>
                                    <Button label="Create Project" toggle={toggleModal}/>
                                </div>
                            </div>
                        </div>
                        
                    ) : (
                        <div className="min-h-screen h-full relative">
                            <BgImage opacity="0.1" />
                            <ProjectModal toggle={toggleModal} modal={modal} projectTitle={projectTitle} setProjectTitle={setProjectTitle} addProject={addProject} />
                            <div className="relative h-full">
                                <Waves />
                                {currentProject ? <ProjectHome 
                                                    currentProject={currentProject}
                                                    projectName={currentProject.title} 
                                                    projectProgress={`${currentProject.progress}%`} 
                                                    updated={updated}
                                                    setUpdated={setUpdated}
                                                    toggleState={toggleState}
                                                    toggleComponent={toggleComponent}
                                                    fetchProjects={fetchProjects}
                                                    /> : (
                                    <div className="max-h-screen h-full">
                                        <div className="w-full px-8 sm:px-16 py-16 sm:py-8 text-5xl sm:text-6xl font-bold mb-16">
                                            Hi<span className="text-blue-marguerite-400">, </span> {name}
                                        </div>
                                        <div className="w-full flex flex-col items-center justify-center text-center px-8 sm:px-16 py-32">
                                            <p className="text-gray-700 hidden sm:block my-8 font-semibold text-xl">Kick things off by selecting a project from the sidebar!</p>
                                            <p className="text-gray-700 block sm:hidden my-8 font-semibold text-xl">To get started, <span className="text-blue-marguerite-400">swipt right </span> to select a project!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Waves() {
    return (
        <div className="absolute bottom-0 w-full -z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#6c67" fillOpacity="1" d="M0,192L24,186.7C48,181,96,171,144,192C192,213,240,267,288,256C336,245,384,171,432,165.3C480,160,528,224,576,229.3C624,235,672,181,720,138.7C768,96,816,64,864,74.7C912,85,960,139,1008,149.3C1056,160,1104,128,1152,133.3C1200,139,1248,181,1296,202.7C1344,224,1392,224,1416,224L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
            </svg>
        </div>
    )
}

function Button(props) {
    return (
        <button className="cursor-pointer font-display relative inline-flex items-center pr-12 pl-10 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50" 
        onClick={props.toggle}
        >
            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>

            <span className="relative">{props.label}</span>
        </button>
    );
}


function BgImage(props) {
    return (
        <div className="absolute inset-0 -z-10" style={{opacity: props.opacity}}>
          
        </div>
    )
}