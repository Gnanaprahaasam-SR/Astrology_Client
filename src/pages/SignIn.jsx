import React, { useState } from "react";
import loginPage from "../assets/Astrology-login.png";
import InputField from "../components/InputField";
import useForm from "../components/useForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { Link } from "react-router-dom";


const SignIn = () => {
    const { value: signInData, handleChange } = useForm({
        mobile: "",
        password: ""
    });

    const [view, setView] = useState(false);

    return (
        <div className="login">
            <div className="container">
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
                    <div className="col-md-6">
                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="signIn-card">
                                <h2 className="text-center mb-4 login-title">Welcome To Mahalakshmi <br /> Astrology</h2>
                                <h4 className="title fw-bold mb-3 text-gray text-center">Sign In</h4>
                                <div>
                                    <InputField
                                        label="Mobile Number"
                                        type="tel"
                                        name="mobile"
                                        labelClassName="label text-gray"
                                        placeholder="Enter Mobile Number"
                                        value={signInData.mobile}
                                        onChange={handleChange}
                                        className="inputField "
                                        pattern="[0-9]{10}"
                                        required
                                    />

                                    <div className="position-relative">
                                        <InputField
                                            label="Password"
                                            type={view ? "text" : "password"}
                                            name="password"
                                            labelClassName="label text-gray"
                                            className="inputField"
                                            placeholder="Enter your Password"
                                            value={signInData.password}
                                            onChange={handleChange}
                                            required
                                            pattern="[@$&#(*)][A-Za-z0-9]"
                                        />
                                        <button className="password-icon" type="button" onClick={() => setView(!view)}>
                                            {view ? <VscEye size={18} /> : <VscEyeClosed size={18} />}
                                        </button>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                        <button type="submit" className="submitButton mb-3">Sign In</button>
                                    </div>
                                    <div className="" >
                                        Create a new account?
                                        <Link to={"/signUp"} className="link"> Sign Up</Link>
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

export default SignIn;