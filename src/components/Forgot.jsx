import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import useForm from "./useForm";
import { Error, Success, Warring } from "./Alert";
import InputField, { PasswordField } from "./InputField";
import Loader from "./Loader";


const ApiUrl = import.meta.env.VITE_APP_SERVER;

const ForgotPassword = ({ show, onHide }) => {

    const { value: signUpData, handleChange, reset } = useForm({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorDetails, setErrorDetails] = useState();

    const handleClose = () => {
        reset();
        setErrorDetails();
        onHide();
    };

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

        if (Object.keys(errors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.put(`${ApiUrl}/api/resetPassword`, {
                    email: signUpData.email,
                    password: signUpData.password,
                    confirmPassword: signUpData.confirmPassword
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    Success("Password updated successfully")
                    handleClose();
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    Error('Please given correct Email Id')
                } else if (error.response?.status === 422) {
                    Error('Failed to update password');
                } else {
                    Error("Something went wrong");
                }

            } finally {
                setLoading(false);
            }

        } else {
            Warring("Please enter all fields")
        }
    };



    return (
        <>
            {loading && <Loader />}
            <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} size=" p-5 " contentClassName=" modalView ">

                <Modal.Title className="title modalTitle mt-3">Reset Password</Modal.Title>


                <Modal.Body className="my-3" >
                    <>
                        <InputField
                            label="Email Id"
                            type="email"
                            name="email"
                            labelClassName="text-gray mx-2"
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
                            labelClassName=" text-gray mx-2"
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
                            labelClassName=" text-gray mx-2"
                            className="inputField"
                        />

                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="danger" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="success" onClick={handleSubmit}>
                                Update
                            </Button>
                        </div>

                    </>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ForgotPassword;
