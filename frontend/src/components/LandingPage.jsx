import logo from "../assets/getToWork.png";
import heroImg from "../assets/heroImg.jpg"
import { Link, Navigate } from 'react-router-dom';
import bgImg from "../assets/ooorganize.svg";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useEffect } from "react";

export function LandingPage() {

    const navigate = useNavigate();

    const isToken = useCallback(() => {
        const safeToken = localStorage.getItem('token');
        if(safeToken) {
            navigate('/userhome');
        }
    }, [])

    useEffect(() => {
        isToken();
    }, []);

    return (
        <div className="w-full min-h-screen">
            <Navbar />
            <BgImage />
            <div className="z-10 flex flex-col">
                <div className="flex flex-col sm:flex-row">
                    <HeroImage />
                    <Hero />
                </div>
                <Wave />
            </div>
            <Footer />
        </div>
    )
}

function BgImage() {
    return (
        <div className="absolute inset-0 -z-10 opacity-10">
            {/* <img className="w-full h-full object-cover" src={bgImg} alt="Background" /> */}
        </div>
    )
}


function Navbar() {
    return (
        <div className="w-full h-18 sm:h-24 justify-around flex flex-row">
            <div className="flex justify-center sm:justify-start px-4 py-4">
               
                <h1 className="w-3/5 aspect-w-3 aspect-h-1 sm:hidden text-6xl font-extrabold">OrganizeIt.</h1>
           
                <h1 className="hidden sm:block w-75 text-6xl font-extrabold">OrganizeIt.</h1>
            </div>
            <div className="hidden sm:flex sm:justify-center sm:items-center sm:px-4">
                <Button label="Sign Up" route="/signup" />
            </div>
        </div>
    );
}


function Wave() {
    return (
        <div>
            <svg viewBox="0 700 1920 400" xmlns="http://www.w3.org/2000/svg">
                <rect fill="#3d1051" />
                <path
                    d="M1920,1080C1654.3333333333333,1110.6666666666667,267.6666666666667,1098.3333333333333,0,1080C-267.6666666666667,1061.6666666666667,207.83333333333331,980.5,314,970C420.1666666666667,959.5,530.3333333333334,1046.5,637,1017C743.6666666666666,987.5,849.3333333333334,789.6666666666666,954,793C1058.6666666666667,796.3333333333334,1158.3333333333333,1019.8333333333334,1265,1037C1371.6666666666667,1054.1666666666667,1484.8333333333333,888.8333333333334,1594,896C1703.1666666666667,903.1666666666666,2185.6666666666665,1049.3333333333333,1920,1080C1654.3333333333333,1110.6666666666667,267.6666666666667,1098.3333333333333,0,1080"
                    fill="#6C68" />
            </svg>
        </div>
    )
}

function Footer() {
    return (
        <div className="w-full flex justify-center font-display items-center">
            Made by{' '}
            <a className="text-blue-marguerite-400 pl-1 font-display font-semibold" href="https://www.linkedin.com/in/abhinaw-anand-04a64124a/" target="_blank" rel="noopener noreferrer">
                Abhinaw Anand
            </a>
        </div>
    );
}


function HeroImage() {
    return(
        // <div className="w-full px-48 pt-32">
        <div className="w-full px-8 sm:px-48 pt-8 sm:pt-32 flex justify-center items-center">
            <img className="" src={heroImg} alt="heroImage" />
        </div>
    )
}

function Hero() {
    return(
        <div className="w-full flex flex-col px-8 sm:px-36 pt-8 sm:pt-48">
            <div className="">
                <h2 className="text-3xl sm:text-6xl text-center sm:text-left font-display font-bold mb-4 sm:mb-10">
          
                    <span className="bg-gradient-to-t from-blue-marguerite-400 to-sky-blue-marguerite-200 bg-[length:95%_10px] sm:bg-[length:95%_12px] bg-no-repeat bg-bottom-sm sm:bg-bottom-md mx-3">Productivity</span>
                    <span className="">in Your Pocket</span>
                </h2>
            </div>
            <div className="mb-4 sm:mb-10 font-display font-medium flex justify-center sm:justify-start items-center sm:items-start">
                <p className="p-2 text-xl sm:text-4xl bg-gradient-to-r from-blue-marguerite-500 to-jade-400 text-transparent bg-clip-text">Organize. Analyze. Visualize.</p>
            </div>
            <div className="mt-4 flex flex-row justify-evenly sm:justify-normal">
                <Button label="Sign Up" route="/signup" />
                <ButtonGreen label="Sign In" route="/signin" />
            </div>
        </div>
    )
}

function Button(props) {
    return (
        <Link
            to={props.route}
            className="font-display bg-blue-marguerite-100 sm:bg-transparent cursor-pointer relative inline-flex items-center mx-2 pl-6 pr-6 sm:pr-12 sm:pl-10 py-3 overflow-hidden text-sm sm:text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white group hover:bg-gray-50"
        >
            <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
          
            <span className="relative">{props.label}</span>
        </Link>
    );
}

function ButtonGreen(props) {
    return (
        <Link
            to={props.route}
            className="cursor-pointer bg-jade-100 sm:bg-transparent font-display relative inline-flex items-center mx-2 pl-6 pr-6 sm:pr-12 sm:pl-10 py-3 overflow-hidden text-sm sm:text-lg font-medium text-jade-600 border-2 border-jade-600 rounded-full hover:text-white group hover:bg-gray-50"
        >
            <span className="absolute left-0 block w-full h-0 transition-all bg-jade-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
         
            <span className="relative">{props.label}</span>
        </Link>
    );
}



