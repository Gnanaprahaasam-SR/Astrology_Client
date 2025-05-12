import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import { Error } from "../components/Alert";
import { CancelBooking, ConfirmBooking, RequirementUpdate, ViewBooking } from "../components/UpdateBookingStatus";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";

const SERVICES = ["Jathagam", "Prasanam", "Vastu", "Homam"];
const ApiUrl = import.meta.env.VITE_APP_SERVER;

const Admin = () => {
    const [activeTab, setActiveTab] = useState(SERVICES[0]);
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [viewBooking, setViewBooking] = useState(false);
    const [cancelBooking, setCancelBooking] = useState(false);
    const [confirmBooking, setConfirmBooking] = useState(false);
    const [bookingDetail, setBookingDetail] = useState({});
    const [updateRequirement, setUpdateRequirement] = useState(false);

    // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);


    const fetchBooking = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ApiUrl}/api/bookingDetails`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                const sortedData = response.data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setBookings(sortedData)
            }
        } catch (error) {
            // console.log(error.message || 'Failed to fetch bookings');
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

    useEffect(() => {
        fetchBooking();
    }, []);

    // Filter bookings for current tab/service
    const ServiceFilter = useMemo(() =>
        bookings.filter(
            (b) => b.selectedServices.toLowerCase() === activeTab.toLowerCase()
        ),
        [activeTab, bookings]
    );

    // Filter bookings by search
    const filteredBookings = useMemo(() => {
        if (!search) return ServiceFilter;
        const lower = search.toLowerCase();
        return ServiceFilter.filter(b =>
            (b.userId && b.userId.toLowerCase().includes(lower)) ||
            (b.name && b.name.toLowerCase().includes(lower)) ||
            (b.phone && b.phone.toLowerCase().includes(lower)) ||
            (b.serviceType && b.serviceType.toLowerCase().includes(lower)) ||
            (b.bookingStatus && b.bookingStatus.toLowerCase().includes(lower)) ||
            (b.bookingId && String(b.bookingId).toLowerCase().includes(lower)) ||
            (b.date && b.date.toLowerCase().includes(lower))
        );
    }, [search, ServiceFilter]);


    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = Math.min(startIndex + rowsPerPage - 1, filteredBookings.length);

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Handlers
    const handleSearch = e => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAction = () => {
        setCancelBooking(false);
        setConfirmBooking(false);
        setViewBooking(false);
        setBookingDetail({});
        setUpdateRequirement(false);
        fetchBooking();
    }


    return (
        <div className=" my-5">
            {loading && <Loader />}

            <div className="container table-bg p-2 rounded-4 " >
                <div className="tabHeader">
                    {SERVICES.map((service) => (
                        <button
                            key={service}
                            onClick={() => { setActiveTab(service); setCurrentPage(1); }}
                            className={activeTab === service ? "activetab" : "inactivetab"}
                        >
                            {service}
                        </button>
                    ))}
                </div>
                <input
                    type="search"
                    placeholder=" Search..."
                    value={search}
                    onChange={handleSearch}
                    className="search"
                />
                {/* Table */}
                <div className="responsive-table-container">
                    <table className="">
                        <thead>
                            <tr style={{ background: "rgba(58, 57, 57, 0.3)" }}>
                                {/* <th>User ID</th> */}
                                <th style={{ whiteSpace: "nowrap" }}>User Name</th>
                                <th >Phone</th>
                                <th style={{ whiteSpace: "nowrap" }}>Service Type</th>
                                <th  >Count</th>
                                <th>Date</th>
                                <th>Timing</th>
                                <th style={{ whiteSpace: "nowrap" }}>Booking Status</th>
                                <th style={{ whiteSpace: "nowrap" }}>Booking ID</th>
                                {(activeTab === "Vastu" || activeTab === "Homam") &&
                                    <th style={{ whiteSpace: "nowrap" }}>G-map Link</th>
                                }
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={activeTab === "Vastu" || activeTab === "Homam" ? 11 : 10} style={{ textAlign: "center", padding: 20 }}>
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedBookings.map((booking, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                        {/* <td>{booking.userId}</td> */}
                                        <td>{booking.name || booking.userName}</td>
                                        <td>{booking.phone}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>{booking.serviceType ?? "-"}</td>
                                        <td className="text-center" style={{ whiteSpace: "nowrap" }}>{booking.count ?? "-"}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>{booking.date}</td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            {booking.timeSlots && booking.timeSlots.length > 0
                                                ? booking.timeSlots.map(
                                                    (slot, i) =>
                                                        <div key={i}>
                                                            {slot.startTime} - {slot.endTime}
                                                        </div>
                                                )
                                                : "-"}
                                        </td>
                                        <td className="text-center">
                                            <span className={booking.bookingStatus === "Confirmed" ? 'confirmed-status' : booking.bookingStatus === "Cancelled" ? 'cancelled-status' : 'pending-status'} >{booking.bookingStatus}</span>
                                        </td>
                                        <td>{booking.bookingId}</td>
                                        {(activeTab === "Vastu" || activeTab === "Homam") && (
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                {booking.mapLink ? (
                                                    <a
                                                        href={booking.mapLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "white", textDecoration: "underline" }}
                                                    >
                                                        View Map
                                                    </a>
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                        )}
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            {booking.bookingStatus !== "Cancelled" &&
                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => { setCancelBooking(true); setBookingDetail(booking); }}
                                                >
                                                    <ImCancelCircle size={18} />
                                                </button>
                                            }
                                            {booking.bookingStatus === "Pending" ?
                                                < button
                                                    className="confirm-btn"
                                                    onClick={() => { setConfirmBooking(true); setBookingDetail(booking); }}
                                                >
                                                    <FaCheck size={18} />
                                                </button> :
                                                < button
                                                    className="view-btn"
                                                    onClick={() => { setViewBooking(true); setBookingDetail(booking); }}
                                                >
                                                    <MdOutlineRemoveRedEye size={20} />
                                                </button>
                                            }
                                            {activeTab === "Homam" && booking.productList.length <= 0 &&
                                                <button className="view-btn" onClick={() => { setUpdateRequirement(true), setBookingDetail(booking); }}>
                                                    <TfiWrite size={18} />
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


                {/* Pagination Controls */}

                <div className="pageCount my-2">
                    <div>
                        Rows per page:&nbsp;
                        <select value={rowsPerPage} onChange={handleRowsPerPageChange} className="dropdown">
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                        <span className="d-block">
                            {startIndex} – {endIndex} of {filteredBookings.length}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="nav-btn"
                        >
                            <IoIosArrowBack size={18} />
                        </button>

                        {/* {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePageChange(idx + 1)}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 4,
                                    border: "1px solid #ccc",
                                    background: currentPage === idx + 1 ? "#007bff" : "#fff",
                                    color: currentPage === idx + 1 ? "#fff" : "#333",
                                    fontWeight: currentPage === idx + 1 ? "bold" : "normal",
                                }}
                            >
                                {idx + 1}
                            </button>
                        ))} */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="nav-btn"
                        >
                            <IoIosArrowForward size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <RequirementUpdate onHide={handleAction} show={updateRequirement} BookingDetails={bookingDetail} />
            <ConfirmBooking onHide={handleAction} show={confirmBooking} BookingDetails={bookingDetail} />
            <CancelBooking onHide={handleAction} show={cancelBooking} BookingDetails={bookingDetail} />
            <ViewBooking onHide={handleAction} show={viewBooking} BookingDetails={bookingDetail} />
        </div >
    );
}

export default Admin;
