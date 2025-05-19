import React, { useState } from "react";
import "../App.css";
import homan from "../assets/homam.png";
import jathagam from "../assets/jathagam2.png";
import prasanam from "../assets/Prasanam2.png";
import vastu from "../assets/vastu.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import document from "../assets/Homam.pdf";
import Modal from 'react-bootstrap/Modal';

import astamagalam from "../assets/astamagalam.mp3";
import betalLeaf from "../assets/betalLeaf.mp3";
import sooli from "../assets/sozhi.mp3";
import kuladeivam from "../assets/kuladeivam.mp3";


const PrasanamDetails = ({ show, onHide }) => {
    const { t } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            centered
            keyboard={false}
            contentClassName="modalView"
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title className="title text-center">{t("service.prasanamDetails")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p dangerouslySetInnerHTML={{ __html: t("service.requireForBetalLeafPrasanam") }} />
                <audio src={betalLeaf} controls />

                <p dangerouslySetInnerHTML={{ __html: t("service.requireForSooliPrasanam") }} />
                <audio src={sooli} controls />

                <p dangerouslySetInnerHTML={{ __html: t("service.requireForKuladeivamPrasanam") }} />
                <audio src={kuladeivam} controls />

                <p dangerouslySetInnerHTML={{ __html: t("service.requireForAstamagalamPrasanam") }} />
                <audio src={astamagalam} controls />
            </Modal.Body>
        </Modal>
    )
}


const HomamDetails = ({ show, onHide }) => {
    const { t } = useTranslation();
    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            centered
            keyboard={false}
            contentClassName="modalView"
        >
            <Modal.Header closeButton>
                <Modal.Title className="title text-center">{t("service.homamDetails")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p dangerouslySetInnerHTML={{ __html: t("service.requireForHomam") }} />
            </Modal.Body>
        </Modal>
    )
}

const Service = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [viewPrasanam, setViewPrasanam] = useState(false);
    const [viewHomam, setViewHomam] = useState(false);

    const Booking = (data) => {
        if (data === "Vastu" || data === "Homam") {
            navigate(`/Services/Request/${data}`)
        }
        else {
            navigate(`/Services/${data}`);
        }
    };

    const handleClose = () => {
        setViewPrasanam(false);
        setViewHomam(false);
    }

    return (
        <section className="service overflow-hidden ">
            <div className=" container-fluid p-4  ">
                <div className="row g-5 mb-5  ">
                    <div className="col-12 col-lg-6 ">
                        <div className="row  h-100">
                            <div className="service-card ">
                                <div className="col-12 col-sm-3 col-md-3 d-flex justify-content-center ">
                                    <div className="service-img ">
                                        <img src={jathagam} alt="Jathagam" className="w-100" />
                                        <h4 className="mb-2 title text-center" >{t("service.serviceOne")}</h4>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-9 col-md-9">
                                    <div className="p-4">
                                        <h5 >{t("service.requireText")}</h5>
                                        <p dangerouslySetInnerHTML={{ __html: t("service.requireForJathagam") }} />

                                        <button className="service-btn mb-3" onClick={() => { Booking("Jathagam") }}>
                                            {t("service.bookNow")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="row h-100">
                            <div className="service-card">
                                <div className="col-12 col-sm-3 col-md-3 d-flex justify-content-center">
                                    <div className="service-img my-2">
                                        <img src={vastu} alt="vastu" className="w-100" />
                                        <h4 className="mb-2 title text-center">{t("service.serviceTwo")}</h4>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-9 col-md-9">
                                    <div className="p-4">
                                        <h5>{t("service.requireText")}</h5>
                                        <p dangerouslySetInnerHTML={{ __html: t("service.requireForVastu") }} />

                                        <button className="service-btn mb-3" onClick={() => { Booking("Vastu") }}>
                                            {t("service.bookNow")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-5 ">
                    <div className="col-12 col-lg-6">
                        <div className="row h-100">
                            <div className="service-card ">
                                <div className="col-12 col-sm-3 col-md-3 d-flex justify-content-center">
                                    <div className="service-img my-2">
                                        <img src={prasanam} alt="prasanam" className="w-100" />
                                        <h4 className="mb-2 title text-center">{t("service.serviceThree")}</h4>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-9 col-md-9">
                                    <div className="p-4">
                                        <h5>{t("service.requireText")}</h5>
                                        <p className="requirement" dangerouslySetInnerHTML={{ __html: t("service.requireForPrasanam1") }} />
                                        <button className="readmore" onClick={() => setViewPrasanam(true)}>{t("service.readMore")}...</button>
                                        <button className="service-btn mb-3" onClick={() => { Booking("Prasanam") }}>
                                            {t("service.bookNow")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="row h-100">
                            <div className="service-card ">
                                <div className="col-12 col-sm-3 col-md-3 d-flex justify-content-center">
                                    <div className="service-img my-2">
                                        <img src={homan} alt="homan" className="w-100" />
                                        <h4 className="mb-2 title text-center">{t("service.serviceFour")}</h4>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-9 col-md-9">
                                    <div className="p-4">
                                        <h5>{t("service.requireText")}</h5>
                                        <p className="requirement" dangerouslySetInnerHTML={{ __html: t("service.requireForHomam") }} />

                                        <button className="readmore" onClick={() => window.open(document, '_blank')}>{t("service.readMore")}...</button>
                                        <button className="service-btn mb-3" onClick={() => { Booking("Homam") }}>
                                            {t("service.bookNow")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PrasanamDetails show={viewPrasanam} onHide={handleClose} />
            <HomamDetails show={viewHomam} onHide={handleClose} />
        </section >
    )
};

export default Service;