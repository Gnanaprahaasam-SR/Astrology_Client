import InputField from "../components/InputField";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../components/useForm";
import "../App.css";
import Select from 'react-select';
import { IoCaretBack } from "react-icons/io5";
import axios from "axios";
const ApiUrl = import.meta.env.VITE_APP_SERVER;
import { useSelector } from "react-redux";
import { Error, Success, Warring } from "../components/Alert";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loader from "../components/Loader";



const customStyles = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? "2px solid #ffc44a" : state.isHover ? "2px solid rgb(204, 204, 204, .2)" : "2px solid rgb(204, 204, 204, .2)",
        textWrap: "nowrap",
        boxShadow: "none",
        borderRadius: "50px",
        backgroundColor: "rgb(255, 255, 255, .6)",
        '&hover': {
            border: "2px solid rgb(204, 204, 204, .2)",
        }
    }),
    menu: (base) => ({
        ...base,
        maxHeight: 120,
        overflowY: 'auto',
        backgroundColor: "#ffc44a"
    }),
    option: (base, state) => ({
        ...base,
        padding: 4,
        fontSize: 14,
        backgroundColor: state.isFocused ? "var(--info-card)" : "#ffc44a",
        color: state.isFocused ? "white" : "black"
    }),
};

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const BookingService = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const userDetails = useSelector((state) => state.user?.user)

    const HomamOptions = [
        { value: 'ganapathyHoma', label: t('service.ganapathy_homam') },
        { value: 'kirahaPrethesam', label: t('service.kiraha_prethesam') },
        { value: 'marriage', label: t('service.marriage') },
        { value: 'kumbaAbishegam', label: t('service.kumba_abishegam') },
        { value: 'sudarshanaHomam', label: t('service.sudarshana_homam') },
        { value: 'mahalakshmiHomam', label: t('service.mahalakshmi_homam') },
        { value: 'chandiHomam', label: t('service.chandi_homam') },
        { value: 'navaGrahaHomam', label: t('service.nava_graham_homam') },
        { value: 'pariharaHomam', label: t('service.parihara_homam') },
        { value: 'ayushHomam', label: t('service.ayush_homam') },
    ];

    const { category: service } = useParams("category"); // Correct destructuring
    const { value: bookingDetails, handleChange, setValues, reset } = useForm({
        userName: "",
        mobile: "",
        address: "",
        service: service,
        type: "",
        bookingDate: new Date().toISOString().split("T")[0],
        mapLink: "",
    });
    // console.log(bookingDetails)

    const handleTypeChange = (selectedOption) => {
        setValues({ type: selectedOption?.value || "" });
    };

    const handleBooking = async () => {
        
        if (bookingDetails.mobile.length < 10) {
            Warring("Give valid phone number");
            return;
        }
        if (!bookingDetails.userName || !bookingDetails.mobile || !bookingDetails.mobile || !bookingDetails.address || !bookingDetails.service || !bookingDetails.bookingDate || !bookingDetails.mapLink) {
            Error('All mandatory fields are required')
            return;
        }
        if (bookingDetails.service === "Homam" && !bookingDetails.type) {
            Error('All mandatory fields are required')
            return;
        }

        try {
            setLoading(true)
            const response = await axios.post(`${ApiUrl}/api/book-slot`, {
                userId: userDetails._id,
                name: bookingDetails.userName,
                phone: bookingDetails.mobile,
                address: bookingDetails.address,
                selectedServices: bookingDetails.service,
                date: formatDate(bookingDetails.bookingDate),
                mapLink: bookingDetails.mapLink,
                serviceType: bookingDetails.type,
                timeSlots: [],
                count: 1,
                bookingStatus: "Pending"
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            // console.log(response);

            if (response.status === 201) {
                Success('Booking Successfull')
                reset();
                handleTypeChange();
                navigate("/Services")
            }

        }
        catch (error) {
            // console.log("Error on Booking Service Api", error)
            const status = error.response.status
            if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 200);
            }
            else if (status === 409) {
                Error('Already Booked')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="booking">
            {loading && <Loader />}
            <div className="container col-12 col-md-8 py-4 ">
                <div>
                    <button className="back-btn mb-3 text-danger" onClick={() => navigate(-1)}> <IoCaretBack /> {t('service.back')}</button>
                </div>

                <div className="row shadow p-4 m-1 rounded-4 booking-card">

                    <h2 className="title text-center mb-3">{service === "Vastu" ? t("service.vastuBooking") : t('service.homamBooking')} </h2>
                    <div className="col-12 col-sm-6">
                        <InputField
                            label={t("service.bookingName")}
                            type="text"
                            name="userName"
                            labelClassName=" fieldLabel"
                            placeholder={t("service.enterName")}
                            value={bookingDetails.userName}
                            onChange={handleChange}
                            className="inputField"
                            required
                            group="inputGroup"
                            important={true}
                            maxLength={255}
                        />
                    </div>

                    <div className="col-12 col-sm-6">
                        <InputField
                            label={t("service.mobileNumber")}
                            type="number"
                            name="mobile"
                            labelClassName=" fieldLabel"
                            placeholder={t('service.enterPhoneNumber')}
                            value={bookingDetails.mobile}
                            onChange={handleChange}
                            className="inputField"
                            pattern="^[0-9]{10}$"
                            required
                            group="inputGroup"
                            important={true}
                            maxLength={10}
                            min={0}
                        />
                    </div>

                    {service === "Homam" && (
                        <div className="col-12 col-sm-6 mb-2">
                            <label htmlFor="serviceType" className="fieldLabel">
                                {t("service.selectServiceType")} <span className=''>*</span>
                            </label>
                            <Select
                                options={HomamOptions}
                                value={HomamOptions.find(opt => opt.value === bookingDetails.type)}
                                onChange={handleTypeChange}
                                styles={customStyles}
                                placeholder={t("service.selectService")}
                                isClearable={true}
                            />
                        </div>
                    )}

                    <div className="col-12 col-sm-6">
                        <label htmlFor="date" className="fieldLabel">{t("service.bookingDate")} <span className=''>*</span></label>
                        <input
                            type="date"
                            name="bookingDate"
                            value={bookingDetails.bookingDate}
                            onChange={handleChange}
                            className="inputField"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="col-12 col-sm-6 mb-2">
                        <label htmlFor="maplink" className="fieldLabel">{t('service.mapLink')} <span className="">*</span></label>
                        <textarea
                            name="mapLink"
                            id="maplink"
                            value={bookingDetails.mapLink}
                            onChange={handleChange}
                            className="inputField"
                        />
                    </div>
                    <div className="col-12 col-sm-6 mb-2">
                        <label htmlFor="address" className="fieldLabel">{t("service.address")} <span className="">*</span></label>
                        <textarea
                            name="address"
                            id="address"
                            value={bookingDetails.address}
                            onChange={handleChange}
                            className="inputField"
                            rows={3}
                        />
                    </div>

                    <div className="text-center">
                        <button className="submitButton " onClick={handleBooking}> Submit</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingService;
