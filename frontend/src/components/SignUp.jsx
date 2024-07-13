import { useState, useEffect } from 'react';
import signUpPicture from '../assets/signUpPicture.jpg';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { nameSchema, emailSchema, passwordSchema } from '../validations/signUpValidations';
import { InfoAlert } from './alerts/InfoAlert';
import { SuccessAlert } from './alerts/SuccessAlert';
import { ErrorAlert } from './alerts/ErrorAlert';
import bgImg from "../assets/checkered.svg";
import backendUrl from "../global";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [tnc, setTnc] = useState(false);
    const [nameError, setNameError] = useState(null);
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

    const navigateToSignIn = () => {
        navigate('/signin');
    };

    const navigateToTnC = () => {
        navigate('/termsandconditions');
    };

    const validateName = (value) => {
        const result = nameSchema.safeParse(value);
        console.log(result);
        setNameError((result.error && value.length !=0 )  ? "You need to enter a valid input here" : null);
    };

    const validateEmail = (value) => {
        const result = emailSchema.safeParse(value);
        console.log(result);
        setEmailError((result.error && value.length !=0 ) ? "Invalid e-mail format" : null);
    };

    const validatePassword = (value) => {
        const result = passwordSchema.safeParse(value);
        console.log(result);
        setPwdError((result.error && value.length !=0 ) ? "Your password needs to be minimum 8 characters" : null);
    };

    const signUpBackendCall = async (name, email, pwd) => {
        const nameResult = nameSchema.safeParse(name);
        const emailResult = emailSchema.safeParse(email);
        const pwdResult = passwordSchema.safeParse(pwd);

        console.log("Sign Up Backend Call results -----");
        console.log(nameResult);
        console.log(emailResult);
        console.log(pwdResult);
        
        if(nameResult.success && emailResult.success && pwdResult.success) {
            try {
                const response = await axios.post(`${backendUrl}/signup`, {
                name: name,
                email: email,
                password: pwd
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                validateStatus: function (status) {
                    return status >= 200 && status < 500; 
                }
            });
    
            // console.log(response);
            if(response.status === 200) {
                setShowSuccessAlert(true);
                setLabel("Sign Up was successful");
                setTimeout(() => {
                    navigate("/signin");
                }, 1000);
            } else if(response.status === 420) {
                setShowErrorAlert(true);
                setLabel("User with a similar email already exists");
                
            }

            return(response);

            } catch(err) {
                console.log("There was some error in making the backend call to Sign Up");
                console.log(err);
                setShowErrorAlert(true);
                setLabel("Sign up was not successful, please try again after some time");
            }
        } else {
            if(!nameResult.success) {
                // alert('name');
                setShowInfoAlert(true);
                setLabel("Make sure you enter at least one character in the 'Name' field");
                // alert("Make sure you enter at least one character");
            } else if(!emailResult.success) {
                // alert('email');
                setShowErrorAlert(true);
                setLabel("Your email format is invalid");
                // alert("Your email format is invalid");
            } else {
                // alert('pwd');
                setShowErrorAlert(true);
                setLabel("Your password needs to be of minimum 8 characters");
                // alert('Your password needs to be of minimum 8 characters');
            }
        }        
    }
    
    

    return(
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
            <div className="xl:grid xl:grid-cols-2 flex flex-col bg-white font-display w-4/5 lg:w-2/3 h-4/5 rounded-2xl shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] z-10">
                <div className="px-5 md:px-9 py-5 md:py-9">
                    <div className="flex flex-col md:flex-row px-5">
                        <p className='text-xs xl:pb-5 xl:pt-4 xl:pr-1'>Already have an account?</p>
                        <a className='text-xs underline decoration-{sky-500} text-sky-500 md:pl-1 xl:pb-5 xl:pt-4 xl:pr-1 cursor-pointer' onClick={navigateToSignIn}>Sign in</a>
                    </div>
                    <div className="lg:text-4xl text-3xl font-bold text-gray-900 py-8 px-5">
                        <p>Sign Up 📝</p>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-1 flex flex-col">
                        <Field label="Name" givenType="text" val={name} setFn={setName} validateFn={validateName} error={nameError} setError={setNameError} />
                        <Field label="Email" givenType="text" val={email} setFn={setEmail} validateFn={validateEmail} error={emailError} setError={setEmailError} />
                    </div>
                    <Field label="Password" givenType="password" val={pwd} setFn={setPwd} validateFn={validatePassword} error={pwdError} setError={setPwdError} />
                    <TnC fn={navigateToTnC} setFn={setTnc}/>
                    <Button label="Sign Up" name={name} email={email} password={pwd} tnc={tnc} backendCall={signUpBackendCall} showAlert={setShowInfoAlert} settingLabel={setLabel}/>
                </div>
                <div className="hidden xl:flex items-center">
                    <img className="object-cover" src={signUpPicture} alt="picture" />
                </div>
            </div>
        </div>
    )
}

function Field(props) {
    return(
        <div className="py-2 font-display px-5">
            <p className='text-xs pb-2'>{props.label}</p>
            <input className='px-2 py-2 border-solid border-2 text-xs border-gray-500/50 rounded-lg w-full' type={props.givenType} onChange={(e) => {
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
        <div className='flex justify-center font-display py-8 px-5'>
            <button className='w-full text-white bg-blue-marguerite-500 text-xs rounded-lg drop-shadow-xl hover:bg-blue-marguerite-700 py-2' onClick={async () => {
                if(!props.tnc) {
                    // alert('tnc');
                    props.showAlert(true);
                    props.settingLabel("Please read and accept the Terms and Conditions");
                } else {
                    let res = await props.backendCall(props.name, props.email, props.password);
                }
            }}>{props.label}</button>
        </div>
    )
}

function TnC(props) {
    return (
        <div className='py-4 px-5 flex flex-row font-display items-center'>
            <input id='tncCheckbox' className='size-3 rounded-lg' type='checkbox' onChange={(e) => {
               props.setFn(e.target.checked);
            }} />
            <label htmlFor='tncCheckbox' className='text-xs pl-2 cursor-pointer'>
                I've read the <a className='text-xs underline text-sky-500 cursor-pointer' onClick={props.fn}>Terms and Conditions</a>
            </label>
        </div>
    );
}

function BgImage() {
    return (
        <div className="absolute inset-0 -z-10 opacity-10">
            <img className="w-full h-full object-cover" src={bgImg} alt="Background" />
        </div>
    )
}