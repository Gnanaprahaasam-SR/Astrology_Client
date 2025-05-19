import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import useForm from "./useForm";
import { Error, Success, Warring } from "./Alert";
import InputField from "./InputField";
import Loader from "./Loader";


const ApiUrl = import.meta.env.VITE_APP_SERVER;

const Forgot = ({ show, onHide }) => {

    const { value: signUpData, handleChange, reset } = useForm({
        email: "",
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

        setErrorDetails(errors)

        if (Object.keys(errors).length === 0) {
            try {
                setLoading(true);
                const response = await axios.post(`${ApiUrl}/api/forgotPassword`, {
                    email: signUpData.email,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    Success(response.data.message)
                    handleClose();
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    Error('Please given correct Email Id')
                } else if (error.response?.status === 424) {
                    Error('Failed to update, Please try again');
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

                <Modal.Title className="title modalTitle mt-3">Forgot Password</Modal.Title>

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

                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="danger" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="success" onClick={handleSubmit}>
                                Verify
                            </Button>
                        </div>

                    </>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Forgot;
