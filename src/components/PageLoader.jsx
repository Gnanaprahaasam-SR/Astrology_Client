import lakshmi from "../assets/Lakshimi.png";

const PageLoader = () => {
    return (
        <div className="center-page">
            <div className="container d-flex align-items-center justify-content-center">
                <div className=" col-12 col-sm-8 col-md-6  position-relative">
                    <div className="god-frame">
                        <img src={lakshmi} className="glow-rotate-img " alt="Glowing" />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PageLoader;