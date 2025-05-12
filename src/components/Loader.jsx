import { RiseLoader } from "react-spinners";
import "../App.css"

const override = {
    display: "block",
    margin: "2 auto",
};

const Loader = () => {
    return (
        <div className='loader overflow-hidden'>
            <RiseLoader
                color="#ffc44a"
                loading={true}
                cssOverride={override}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    )
};

export default Loader;