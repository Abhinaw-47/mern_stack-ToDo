import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import signInPicture from "../assets/signin.jpg"
import {emailSchema, passwordSchema } from '../validations/signInValidation';
import axios from "axios";
import { InfoAlert } from './alerts/InfoAlert';
import { SuccessAlert } from './alerts/SuccessAlert';
import { ErrorAlert } from './alerts/ErrorAlert';
import bgImg from "../assets/checkered.svg";
import backendUrl from "../global";

export function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [pwdError, setPwdError] = useState(null);
    const [showInfoAlert, setShowInfoAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [label, setLabel] = useState("");

    useEffect(() => {
        let timer;
        if (showInfoAlert) {
            timer = setTimeout(() => {
                setShowInfoAlert(false);
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [showInfoAlert]);

    useEffect(() => {
        let successTimer;
        if (showSuccessAlert) {
            successTimer = setTimeout(() => {
                setShowSuccessAlert(false);
            }, 3000);
        }

        return () => clearTimeout(successTimer);
    }, [showSuccessAlert]);

    useEffect(() => {
        let errorTimer;
        if (showErrorAlert) {
            errorTimer = setTimeout(() => {
                setShowErrorAlert(false);
            }, 3000);
        }

        return () => clearTimeout(errorTimer);
    }, [showErrorAlert]);

    const navigate = useNavigate();

    const validateEmail = (value) => {
        const result = emailSchema.safeParse(value);
        // console.log(result);
        setEmailError((result.error && value.length !=0 ) ? "Invalid e-mail format" : null);
    };

    const validatePassword = (value) => {
        const result = passwordSchema.safeParse(value);
        // console.log(result);
        setPwdError((result.error && value.length !=0 ) ? "Your password needs to be minimum 8 characters" : null);
    };

    const signInBackendCall = async (email, password) => {
        const emailResult = emailSchema.safeParse(email);
        const pwdResult = passwordSchema.safeParse(password);

        if(emailResult.success && pwdResult.success) {
            try{
                const response = await axios.post(`${backendUrl}/signin`, {
                    email: email,
                    password: password
                }, {
                    headers: {
                        "Content-Type": 'application/json'
                    }, validateStatus: function (status) {
                        return status >= 200 && status < 500; 
                    }
                })

                console.log(response);
                if(response.status == 403) {
                    setShowErrorAlert(true);
                    setLabel("User does not exist");
                } else if(response.status == 200) {
                    
                    localStorage.setItem('token', `Bearer ${response.data.token}`);

                   
                    setShowSuccessAlert(true);
                    setLabel("Sign In was successful");

                   
                    setTimeout(() => {
                        navigate("/userhome");
                    }, 1000);
                }
            } catch(e) {
                console.log("There was an error in the backend call");
            }
        }
    }

    return(
        // <div className="min-h-screen w-full bg-gradient-to-bl from-transparent via-blue-marguerite-300 flex justify-center items-center">
        <div className="min-h-screen font-display w-full flex flex-col justify-center items-center">
            {showInfoAlert && (
                <InfoAlert label={label} />
            )}
            {showSuccessAlert && (
                <SuccessAlert label={label} />
            )}
            {showErrorAlert && (
                <ErrorAlert label={label} />
            )}
            <BgImage />
            <div className="lg:grid z-10 lg:grid-cols-2 flex flex-col bg-white w-2/3 h-4/5 rounded-2xl shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]">
                <div className="hidden lg:flex items-center">
                    <img className="object-cover" src={signInPicture} alt="picture" />
                </div>
                <div className="md:px-9 md:py-9 px-4 py-4">
                    <div className="xl:text-4xl md:text-2xl text-xl font-bold text-gray-900 py-8 px-5">
                        <p>Hello, again! 👋</p>
                    </div>
                    <Field label="Email" givenType="text" setFn={setEmail} validateFn={validateEmail} setError={setEmailError} error={emailError} val={email}/>
                    <Field label="Password" givenType="password" setFn={setPassword} validateFn={validatePassword} setError={setPwdError} error={pwdError} val={password} />
                    <RememberMe />
                    <Button label="Sign In" backendCall={signInBackendCall} email={email} pwd={password} />
                </div>
            </div>
        </div>
    )
}


function Field(props) {
    return(
        <div className="py-2 px-5 font-display">
            <p className='text-xs pb-2'>{props.label}</p>
            <input className='px-2 py-2 border-solid font-display border-2 text-xs border-gray-500/50 rounded-lg w-full' type={props.givenType} onChange={(e) => {
                props.setFn(e.target.value);
            }} onBlur={() => {
                props.validateFn(props.val);
            }} onFocus={() => {
                props.setError(null);
            }}></input>
            {props.error && <p className="text-red-500 text-xs mt-1">{props.error}</p>}
        </div>
    )
}

function Button(props) {
    return(
        <div className='flex font-display justify-center py-8 px-5'>
            <button className='w-full text-white bg-jade-500 text-xs rounded-lg drop-shadow-xl hover:bg-jade-700 py-2' onClick={async () => {
                let res = await props.backendCall(props.email, props.pwd);
                console.log(res.status);
            }}>{props.label}</button>
        </div>
    )
}

function RememberMe() {
    return(
        <div className='py-4 font-display px-5 flex flex-row items-center'>
            <input id='rememberMeCheckbox' className='size-3 rounded-lg' type='checkbox' />
            <label htmlFor='rememberMeCheckbox' className='text-xs pl-2 cursor-pointer'>
                Remember Me
            </label>
        </div>
    )
}

function BgImage() {
    return (
        <div className="absolute inset-0 -z-10 opacity-10">
            <img className="w-full h-full object-cover" src={bgImg} alt="Background" />
        </div>
    )
}