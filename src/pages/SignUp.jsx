import { useEffect, useRef, useState } from "react";
import loginPage from "../assets/Lakshimi.png";
// import background from "../assets/Login.mp4";
import InputField, { PasswordField } from "../components/InputField";
import useForm from "../components/useForm";
import "../App.css";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import OtpModal from "../components/otpModal/OtpModal"
import { Error, Success } from "../components/Alert";

const ApiUrl = import.meta.env.VITE_APP_SERVER;

const SignUp = () => {
    const { value: signUpData, handleChange, reset } = useForm({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState();
    const [verifyEmail, setVerifyEmail] = useState("");
    const [openOTP, setOpenOTP] = useState(false);
    const handleOpenModal = () => {
        setVerifyEmail(signUpData.email);
        setOpenOTP(true);
    }
    const handleCloseModal = () => {
        setOpenOTP(false);
        setVerifyEmail("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let errors = {};

        // email validation
        if (!signUpData.email) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
            errors.email = "Enter a valid email address";
        }

        // Password validation
        if (!signUpData.password) {
            errors.password = "Password is required";
        } else if (signUpData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(signUpData.password) || !/[0-9]/.test(signUpData.password)) {
            errors.password = "Password must contain at least one uppercase letter and one number";
        }

        // Confirm Password validation
        if (!signUpData.confirmPassword) {
            errors.confirmPassword = "confirm Password is required";
        } else if (signUpData.confirmPassword !== signUpData.password) {
            errors.confirmPassword = "Passwords do not match";
        }

        setErrorDetails(errors)

        if (Object.keys(errors).length !== 0) {
            console.log("Validation Errors", validation.errors);
        }
        else {
            setLoading(true);
            try {
                const response = await axios.post(
                    `${ApiUrl}/api/registerUser`,
                    {
                        email: signUpData.email,
                        password: signUpData.password,
                        profileType: "Customer"
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                );

                // console.log("Verification successful:", response);
                if (response.status === 201) {

                    Success("Token Generated Successfully!")
                    handleOpenModal()
                    reset();
                }
            } catch (error) {
                console.error("Error occurred in API call:", error);
                if (error.response.status === 409) {
                    Error("Email Id is already registered");
                } else if (error.response.status === 500) {
                    Error("Something went wrong. Please try again.");
                } else {
                    Error("Server not found.");
                }
                throw error;
            } finally {
                setLoading(false);
            }
        }
    }

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

            <OtpModal show={openOTP} onClose={handleCloseModal} email={verifyEmail} />
            {loading && <Loader />}
            <div className="container ">
                <div className="row ">
                    <div className="col-md-6 d-none d-sm-none d-md-block">
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="img-backdrop">
                                <div className="img-item">
                                    <img src={loginPage} alt="Mahalakshmi" className="w-100" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="signIn-card">
                                <h2 className="text-center mb-4 login-title">Welcome To Mahalakshmi <br /> Astrology</h2>
                                <h4 className="title fw-bold mb-3 text-gray text-center">Sign Up</h4>
                                <div>
                                    <InputField
                                        label="Email Id"
                                        type="email"
                                        name="email"
                                        labelClassName="text-gray"
                                        placeholder="Enter an Email"
                                        value={signUpData.email}
                                        onChange={handleChange}
                                        className="inputField "
                                        maxLength={255}
                                        required
                                        errorMessage={errorDetails?.email}
                                        group="inputGroup"
                                    />

                                    <PasswordField
                                        label="Password"
                                        name="password"
                                        placeholder="Enter Your Password"
                                        value={signUpData.password}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errorDetails?.password}
                                        group="inputGroup"
                                        labelClassName=" text-gray"
                                        className="inputField"
                                    />

                                    <PasswordField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        placeholder="Enter Your Confirm Password"
                                        value={signUpData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errorDetails?.confirmPassword}
                                        group="inputGroup"
                                        labelClassName=" text-gray"
                                        className="inputField"
                                    />


                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <button type="submit" className="submitButton mb-3" onClick={handleSubmit}>Sign Up</button>
                                    </div>
                                    <div className="text-center text-gray" >
                                        Do you have an  account?
                                        <Link to={"/"} className="link"> Sign In</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;