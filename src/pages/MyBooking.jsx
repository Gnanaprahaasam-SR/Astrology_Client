import axios from "axios";
import "../App.css";
import Prasanam from "../assets/Prasanam2.png";
import Jathagam from "../assets/jathagam2.png";
import Vastu from "../assets/vastu.png";
import Homam from "../assets/homam.png";

import { useEffect, useState } from "react";
import { Error } from "../components/Alert";
import { useDispatch, useSelector } from "react-redux";
import BookingDetails from "../components/BookingDetailsModal";
import { formateDate } from "../utilities/DateFormat";
import { useTranslation } from "react-i18next";
import { logout } from "../redux/userInfo/userInfo";
import Loader from "../components/Loader";

const ApiUrl = import.meta.env.VITE_APP_SERVER;

import { FaBookmark } from "react-icons/fa6";




const MyBooking = () => {

    const userDetails = useSelector((state) => state.user?.user)
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const [data, setData] = useState([]);
    const [view, setView] = useState(false);
    const [viewData, setViewData] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchBooking = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ApiUrl}/api/user-bookings/${userDetails._id}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                setData(response.data)
            }
        } catch (error) {
            console.log(error.message || 'Failed to fetch bookings');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            }
            else if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (userDetails?._id) {
            fetchBooking();
        }
    }, [userDetails?._id]);

    const ShowDetails = (data, view) => {
        setViewData(data);
        setView(view);
    }

    return (
        <div className="booking overflow-hidden">
            {loading && <Loader />}
            <div className="container py-5">
                <div className="row  d-flex align-items-center">
                    {data.length > 0 ?
                        data?.map((booking, index) => {
                            return (
                                <div className="col-12 col-sm-12 col-md-6 pt-5" key={index}>
                                    <div className="shadow booking-card rounded-4 p-3">
                                        <div className="col-6">
                                            <div className="booking-thumbnail">
                                                <img
                                                    src={booking?.selectedServices === "Jathagam" ? Jathagam : booking?.selectedServices === "Prasanam" ? Prasanam : booking?.selectedServices === "Vastu" ? Vastu : Homam}
                                                    alt={booking?.selectedServices}
                                                    className="thumbnail-shadow"
                                                />
                                            </div>
                                            <h4 className="title thumbnail-title">{booking.selectedServices === "Jathagam" ? t("service.serviceOne") : booking.selectedServices === "Prasanam" ? t("service.serviceThree") : booking.selectedServices === "Vastu" ? t("service.serviceTwo") : t("service.serviceFour")}</h4>
                                        </div>

                                        <div className="col-6 booking-details">
                                            <p>{t("service.bookingId")}: {booking.bookingId}</p>
                                            <p>{t("service.date")}: {formateDate(booking.date)}</p>
                                            <p>{t("service.status")}: {booking.bookingStatus}</p>
                                            <p>{t("service.timing")}: {booking.timeSlots.length > 0 ? booking.timeSlots.map(slot => (
                                                `${slot.startTime} - ${slot.endTime}`
                                            )).join(', ') : " NA "}</p>
                                        </div>


                                        <div className=" mx-auto ">
                                            <button
                                                className="service-btn"
                                                onClick={() => ShowDetails(booking, true)}
                                            >
                                                {t("service.moreDetails")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        : <p className="no-booking gap-3 m-auto">
                            <FaBookmark size={15} /> {t("service.no-booking")}
                        </p>
                    }

                </div>
            </div>

            <BookingDetails show={view} onHide={() => { setView(false) }} bookingData={viewData} />
        </div>
    )
}

export default MyBooking;