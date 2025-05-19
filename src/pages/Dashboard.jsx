import moment from "moment";
import MyCalendar from "../components/MySchedule/Calendar";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userInfo/userInfo";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { Error } from "../components/Alert";
const ApiUrl = import.meta.env.VITE_APP_SERVER;



const Dashboard = () => {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);


    useEffect(() => {
        const fetchBooking = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${ApiUrl}/api/bookingDetails`, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                // console.log(response)
                const filterData = response.data.filter(value => { return value.bookingStatus === "Confirmed" });

                const result = filterData.reduce((acc, booking) => {
                    if (booking.timeSlots && booking.timeSlots.length > 0) {
                        // Clean up date and time format if needed
                        // Assuming date is "DD-MM-YYYY" and time is "HH:mm AM/PM"
                        const dateFormatted = moment(booking.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                        const start = moment(`${dateFormatted} ${booking.timeSlots[0].startTime}`, "YYYY-MM-DD hh:mm A").toDate();
                        const end = moment(`${dateFormatted} ${booking.timeSlots[0].endTime}`, "YYYY-MM-DD hh:mm A").toDate();

                        acc.push({
                            start,
                            end,
                            title: booking.selectedServices,
                            service: booking.selectedServices
                        });
                    }
                    return acc;
                }, []);
                // console.log(result)

                if (response.status === 200) {
                    setData(result)
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
                else {
                    Error('Something went wrong')
                }
            } finally {
                setLoading(false);
            }
        }
        fetchBooking();
    }, []);

    return (
        <>
            {loading && <Loader />}
            < MyCalendar event={data} />
        </>
    )
}


export default Dashboard;