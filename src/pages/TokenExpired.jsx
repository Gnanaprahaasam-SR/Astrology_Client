import { BsExclamationTriangleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
const API = import.meta.env.VITE_APP_CLIENT;

const TokenExpired = () => {

    return (
        <div style={{ minHeight: "100vh", width: "100%" }} className="d-flex align-items-center justify-content-center">
            <div className="no-booking gap-3 m-auto ">
                <div className="text-center text-wrap">
                    <p>Your reset Token has been expired. Please try again <BsExclamationTriangleFill size={20} />
                    </p>
                    <Link to={`${API}/SignIn`} className="text-decoration-none btn btn-warning">Check Here to Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default TokenExpired;