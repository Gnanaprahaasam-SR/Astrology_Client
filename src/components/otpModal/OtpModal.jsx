import { useRef, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Error, Success, Warring } from "../Alert";


const ApiUrl = import.meta.env.VITE_APP_SERVER;

const OtpModal = ({ show, onClose, email }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [resend, setResend] = useState(false);

    const handleResend = async () => {
        try {
            const response = await axios.post(`${ApiUrl}/api/ResendOTP`, {
                email: email,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });

            if (response.status === 200) {
                Success("OTP send successfully")
            }
        } catch (error) {
            if (error.response.status === 404) {
                setResend(true)
                Error('Invalid Email Id OTP')
            } else if (error.response.status === 424) {
                setResend(true)
                Error('Failed to resend OTP')
            } else {
                Error("Something went wrong")
            }
        }
    }

    const handleChange = (e, index) => {
        const value = e.target.value;

        if ((/^\d?$/.test(value))) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace and arrow keys
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleClose = () => {
        setOtp(["", "", "", "", "", ""]);
        onClose();
    };

    setTimeout(() => {
        setResend(true)
    }, 4000);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join("");
        // console.log(email, otpString)

        if (otpString.length === 6) {
            try {
                const response = await axios.post(`${ApiUrl}/api/userVerification`, {
                    email: email,
                    otp: otpString,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                if (response.status === 200) {
                    Success("Account verified successfully")
                    handleClose();
                    navigate("/signIn");
                }
            } catch (error) {
                if (error.response.status === 400) {
                    setResend(true)
                    Error('Invalid OTP')
                } else if (error.response.status === 406) {
                    setResend(true)
                    Error('Failed to verify user');
                } else {
                    Error("Something went wrong");
                }
            }

        } else {
            Warring("Please enter complete 6-digit OTP")
        }
    };



    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static" className="d-flex p-4" keyboard={false} size="lg">
            <Modal.Header closeButton>
                <Modal.Title className="title">Enter OTP</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center mb-4">
                        {otp.map((digit, index) => (
                            <Form.Control
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="mx-1 text-center"
                                style={{ width: "3rem", height: "3rem", fontSize: "1.2rem" }}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-danger" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="success" type="submit">
                            Verify
                        </Button>
                    </div>
                    <div className="text-center mt-2 " >
                        {resend && <a onClick={handleResend} className="py-2 btn text-decoration-none text-primary">Resend</a>}
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default OtpModal;
