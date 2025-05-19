import { useEffect, useRef, useState } from "react";
// import background from "../assets/Login.mp4";
import loginPage from "../assets/Lakshimi.png";
import InputField, { PasswordField } from "../components/InputField";
import useForm from "../components/useForm";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Loader from "../components/Loader";
import { loginStart, loginSuccess, loginFailure } from "../redux/userInfo/userInfo";
import axios from "axios";
import { Error, Success } from "../components/Alert";
import { useTranslation } from "react-i18next";
import Forgot from "../components/Forgot";

const ApiUrl = import.meta.env.VITE_APP_SERVER;




const SignIn = () => {
    const { i18n } = useTranslation();
    const { value: signInData, handleChange, reset } = useForm({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [errorLanding, setErrorLanding] = useState({});
    const [openForgot, setOpenForgot] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};

        // Email validation
        if (!signInData.email) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
            errors.email = "Enter a valid email address";
        }

        // Password validation
        if (!signInData.password) {
            errors.password = "Password is required";
        } else if (signInData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(signInData.password) || !/[0-9]/.test(signInData.password)) {
            errors.password = "Password must contain at least one uppercase letter and one number";
        }

        setErrorLanding(errors);

        if (Object.keys(errors).length !== 0) {
            console.log("Validation Errors", validation.errors);
        }
        else {
            dispatch(loginStart());
            try {
                const response = await axios.post(`${ApiUrl}/api/loginUser`, {
                    email: signInData.email,
                    password: signInData.password,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                // console.log("Verification successful:", response);
                if (response.status === 200) {
                    const userType = response?.data?.data
                    dispatch(loginSuccess(userType));
                    reset();
                    Success("Login Successfully!");
                    if (userType.profileType === "Customer") {
                        navigate("/Services")
                    } else {
                        navigate("/")
                        i18n.changeLanguage('en');
                    }
                }
            } catch (error) {
                if (error.response.status === 429) {
                    Error('Too many attempt. Please try again later');
                } else if (error.response.status === 404) {
                    Error(error.response.data.message);
                } else {
                    Error("Server not founded!");
                }
                console.error("Error occurred in API call:", error);
                dispatch(loginFailure(err.message));
            }
        }
    }

    const { loading } = useDispatch((state) => state.user);

    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.1;
        }
    }, []);

    return (
        <div className="login">
            {/* <video ref={videoRef} autoPlay muted loop id="background-video">
                <source src={background} type="video/mp4" />
                Your browser does not support the video tag.
            </video> */}
            {loading && <Loader />}

            <div className=" container">
                <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-md-6 d-none d-sm-none d-md-block">
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="img-backdrop">
                                <div className="img-item">
                                    <img src={loginPage} alt="Mahalakshmi" className="w-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6" >
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="signIn-card">
                                <h2 className="text-center mb-4 login-title">Welcome To Mahalakshmi <br /> Astrology</h2>
                                <h2 className="title fw-bold mb-3 text-gray text-center">Sign In</h2>
                                <div>
                                    <InputField
                                        label="Email Id"
                                        type="email"
                                        name="email"
                                        labelClassName=" text-gray"
                                        placeholder="Enter an Email"
                                        value={signInData.email}
                                        onChange={handleChange}
                                        className="inputField "
                                        maxLength={255}
                                        required
                                        errorMessage={errorLanding?.email}
                                        group="inputGroup"
                                    />

                                    <PasswordField
                                        label="Password"
                                        name="password"
                                        placeholder="Enter Your Password"
                                        value={signInData.password}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errorLanding?.password}
                                        group="inputGroup"
                                        labelClassName=" text-gray"
                                        className="inputField"
                                    />
                                    <div className="text-center">
                                        <a className="link " onClick={() => setOpenForgot(true)}>Forgot Password</a>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <button type="submit" className="submitButton  mb-3" onClick={handleSubmit}>Sign In</button>
                                    </div>
                                    <div className="text-center text-gray" >
                                        Create a new account?
                                        <Link to={"/signUp"} className="link"> Sign Up</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Forgot show={openForgot} onHide={() => setOpenForgot(false)} />
        </div>
    );
}

export default SignIn;