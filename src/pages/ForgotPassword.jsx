import { useState } from "react";
import loginPage from "../assets/Lakshimi.png";
import { PasswordField } from "../components/InputField";
import useForm from "../components/useForm";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import { Error, Success } from "../components/Alert";


const ApiUrl = import.meta.env.VITE_APP_SERVER;



const ForgotPassword = () => {

    const { email } = useParams();
    const { value: forgotPassword, handleChange, reset } = useForm({
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [errorDetails, setErrorDetails] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};

        // Password validation
        if (!forgotPassword.password) {
            errors.password = "Password is required";
        } else if (forgotPassword.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(forgotPassword.password) || !/[0-9]/.test(forgotPassword.password)) {
            errors.password = "Password must contain at least one uppercase letter and one number";
        }


        // Confirm Password validation
        if (!forgotPassword.confirmPassword) {
            errors.confirmPassword = "confirm Password is required";
        } else if (forgotPassword.confirmPassword !== forgotPassword.password) {
            errors.confirmPassword = "Passwords do not match";
        }

        setErrorDetails(errors);

        if (Object.keys(errors).length !== 0) {
            console.log("Validation Errors", validation.errors);
        }
        else {
            setLoading(true);
            try {
                const response = await axios.put(`${ApiUrl}/api/updatePassword`, {
                    email: email,
                    password: forgotPassword.password,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                console.log("Verification successful:", response);
                if (response.status === 200) {
                    reset();
                    Success("Password updated successfully!");
                    navigate("/SignIn", { replace: true });
                }

            } catch (error) {
                if (error.response.status === 429) {
                    Error('Too many attempt. Please try again later');
                } else if (error.response.status === 422) {
                    Error(error.response.data.message);
                } else {
                    Error("Server not founded!");
                }
                console.error("Error occurred in API call:", error);

            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <div className="login">

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
                                <h2 className="title fw-bold mb-3 text-gray text-center">Forgot Password</h2>
                                <div>

                                    <PasswordField
                                        label="Password"
                                        name="password"
                                        placeholder="Enter Your Password"
                                        value={forgotPassword.password}
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
                                        value={forgotPassword.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        errorMessage={errorDetails?.confirmPassword}
                                        group="inputGroup"
                                        labelClassName=" text-gray"
                                        className="inputField"
                                    />

                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <button type="submit" className="submitButton  mb-3" onClick={handleSubmit}>Update Password</button>
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

export default ForgotPassword;