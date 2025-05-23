import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Error, Success } from "./Alert";
import axios from "axios";
import { logout } from "../redux/userInfo/userInfo";
import { useDispatch } from "react-redux";
import Loader from "./Loader";
const ApiUrl = import.meta.env.VITE_APP_SERVER;

const HourFormat = (time24) => {
    if (!time24) return "";
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hour}:${minute} ${ampm}`;
}

const to24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

export const ConfirmBooking = ({ show, onHide, BookingDetails }) => {
    const dispatch = useDispatch();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [bookingDetails, setBookingDetails] = useState(BookingDetails);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setBookingDetails(BookingDetails || {});
        if (
            BookingDetails &&
            BookingDetails.timeSlots &&
            BookingDetails.timeSlots.length > 0
        ) {
            // Convert "01:30 PM" to "13:30" for <input type="time" />
            setStartTime(to24Hour(BookingDetails.timeSlots[0].startTime));
            setEndTime(to24Hour(BookingDetails.timeSlots[0].endTime));
        } else {
            setStartTime("");
            setEndTime("");
        }
    }, [BookingDetails]);

    const handleConfirm = async () => {
        if (!startTime || !endTime) {
            Error("Please enter both start and end time.");
            return;
        }

        const startValue = HourFormat(startTime);
        const endValue = HourFormat(endTime);

        try {
            setLoading(true)
            const response = await axios.put(`${ApiUrl}/api/updatebookingStatus`, {
                id: bookingDetails.bookingId,
                timeSlots: [{ startTime: startValue, endTime: endValue }],
                bookingStatus: "Confirmed",
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                Success('Booking status updated successfully');
                onHide();
            }
        } catch (error) {
            console.log(error.message || 'Failed to update bookings');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            } else if (status === 404) {
                Error('Invalid BookingId !')
            } else if (status === 400) {
                Error('TimeSlot is already Booked')
            }
            else if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 200);
            } else {
                Error('Something went wrong')
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            {loading && < Loader />}
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                keyboard={false}
                contentClassName="modalView"

            >

                <Modal.Title className="title modalTitle">
                    {bookingDetails.selectedServices} Service
                </Modal.Title>

                <Modal.Body>
                    <table >
                        <tbody style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                            <tr>
                                <th>User Name</th>
                                <td>{bookingDetails.name || "-"}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{bookingDetails.phone || "-"}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{bookingDetails.address || "-"}</td>
                            </tr>
                            <tr>
                                <th>Service Type</th>
                                <td>{bookingDetails.serviceType || "-"}</td>
                            </tr>
                            <tr>
                                <th>Count</th>
                                <td>{bookingDetails.count ?? "-"}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{bookingDetails.date || "-"}</td>
                            </tr>
                            <tr>
                                <th>Booking Status</th>
                                <td>{bookingDetails.bookingStatus || "-"}</td>
                            </tr>
                            <tr>
                                <th>Booking ID</th>
                                <td>{bookingDetails.bookingId || "-"}</td>
                            </tr>
                            {bookingDetails.mapLink && (
                                <tr>
                                    <th>Map Link</th>
                                    <td>
                                        <a
                                            href={bookingDetails.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white"
                                        >
                                            View Map
                                        </a>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th>Start Time</th>
                                <td>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="form-control mb-2"
                                        style={{ display: "inline-block", width: 140 }}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>End Time</th>
                                <td>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="form-control mb-2"
                                        style={{ display: "inline-block", width: 140 }}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </Modal.Body>
                <Modal.Footer>
                    <button className="modalClose" onClick={onHide} disabled={loading}>
                        Close
                    </button>
                    <button style={{
                        padding: "4px 10px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }} onClick={handleConfirm} disabled={loading}>
                        Confirm Booking
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const CancelBooking = ({ show, onHide, BookingDetails }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const handleConfirm = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`${ApiUrl}/api/updatebookingStatus`, {
                id: BookingDetails.bookingId,
                timeSlots: [],
                bookingStatus: "Cancelled",
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                Success('Booking status cancelled successfully');
                onHide();
            }
        } catch (error) {
            console.log(error.message || 'Failed to update bookings');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            } else if (status === 404) {
                Error('Booking status update failed !')
            }
            else if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 200);
            } else {
                Error('Something went wrong')
            }
        } finally {
            setLoading(false)
        }

    };
    return (
        <>
            {loading && < Loader />}
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                keyboard={false}
                contentClassName="modalView"
            >
                <Modal.Title className="title modalTitle">Cancel {BookingDetails.selectedServices} Service </Modal.Title>

                <Modal.Body>
                    <p className="text-center">Are you sure you want to cancel {BookingDetails.selectedServices} service  ?<br />(Booking ID: {BookingDetails.bookingId}) </p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="modalClose" onClick={onHide} disabled={loading}>
                        Close
                    </button>
                    <button style={{
                        padding: "4px 10px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }} onClick={handleConfirm} disabled={loading}>
                        Cancel Booking
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export const JathagamMatching = ({ show, onHide, BookingDetails }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {

        try {
            setLoading(true)
            const response = await axios.put(`${ApiUrl}/api/updatebookingStatus`, {
                id: BookingDetails.bookingId,
                timeSlots: [],
                bookingStatus: "Confirmed",
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                Success('Booking status updated successfully');
                onHide();
            }
        } catch (error) {
            console.log(error.message || 'Failed to update bookings');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            } else if (status === 404) {
                Error('Invalid BookingId !')
            } else if (status === 400) {
                Error('TimeSlot is already Booked')
            }
            else if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 200);
            } else {
                Error('Something went wrong')
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            {loading && < Loader />}
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                keyboard={false}
                contentClassName="modalView"

            >

                <Modal.Title className="title modalTitle">
                    Jathagama Matching
                </Modal.Title>

                <Modal.Body>
                    <table >
                        <tbody style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                            <tr>
                                <th>User Name</th>
                                <td>{BookingDetails.name || "-"}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{BookingDetails.phone || "-"}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{BookingDetails.address || "-"}</td>
                            </tr>
                            <tr>
                                <th>Service Type</th>
                                <td>{BookingDetails.serviceType || "-"}</td>
                            </tr>
                            <tr>
                                <th>Count</th>
                                <td>{BookingDetails.count ?? "-"}</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{BookingDetails.date || "-"}</td>
                            </tr>
                            <tr>
                                <th>Booking Status</th>
                                <td>{BookingDetails.bookingStatus || "-"}</td>
                            </tr>
                            <tr>
                                <th>Booking ID</th>
                                <td>{BookingDetails.bookingId || "-"}</td>
                            </tr>
                            {BookingDetails.mapLink && (
                                <tr>
                                    <th>Map Link</th>
                                    <td>
                                        <a
                                            href={BookingDetails.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white"
                                        >
                                            View Map
                                        </a>
                                    </td>
                                </tr>
                            )}

                            {BookingDetails?.document?.length > 0 &&
                                <tr>
                                    <th>Horoscope Copy</th>
                                    <td>
                                        {BookingDetails?.document.map((data, index) => (
                                            <React.Fragment key={index}>
                                                <a
                                                    href={data}
                                                    download={`Document-${index + 1}.jpg`}
                                                    rel="noopener noreferrer"
                                                    className="text-white"
                                                >
                                                    Download Document
                                                </a>
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </td>
                                </tr>
                            }

                        </tbody>
                    </table>

                </Modal.Body>
                <Modal.Footer>
                    <button className="modalClose" onClick={onHide} disabled={loading}>
                        Close
                    </button>
                    <button style={{
                        padding: "4px 10px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }} onClick={handleConfirm} disabled={loading}>
                        Confirm Booking
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export const RequirementUpdate = ({ show, onHide, BookingDetails }) => {
    const dispatch = useDispatch();

    // List of items
    const items = {
        home: [
            "குத்துவிளக்கு", "தாம்பாளம்", "சிறியதட்டம்", "அடுக்கு பாத்திரம்", "கரண்டி", "டம்ளர்",
            "மணி", "சந்தணக் கிண்ணம்", "கொடுவாள்", "கத்தி", "ஆசனப் பலகை", "நிறைகுடம் தண்ணீர்",
            "பால்", "தயிர்", "ஹோமியம்", "சாணம்", "சுவாமி படம்", "மா இலை", "செங்கல்", "மணல்",
            "சவுக்கு விறகு", "வைக்கோல் பொம்மை", "பழைய பேப்பர்", "ஹோம குண்டம்", "1 ரூபாய் நாணயம்"
        ],
        market: [
            "தேங்காய்", "கொய்யா", "தாமரைப் பூ", "பூசணிக்காய்", "சப்போட்டா", "துளசி", "வாழைப்பழம்",
            "மாதுளை", "அரளி", "வெற்றிலை", "திராட்சை", "உதிரி பூ", "வாழை இலை", "கழுத்து மாலை",
            "மருகு", "எலுமிச்சம்பழம்", "நிலவு மாலை", "அருகம்புல்", "ஆப்பிள்", "சாமிபட மாலை",
            "ஆரஞ்சு", "தொடர் பூ", "சாத்துக்குடி", "மல்லித்தொடர்"
        ]
    };

    const Items = {
        home: [
            "lamp",            // குத்துவிளக்கு
            "tray",            // தாம்பாளம்
            "smallPlate",      // சிறியதட்டம்
            "stackedVessel",   // அடுக்கு பாத்திரம்
            "ladle",           // கரண்டி
            "tumbler",         // டம்ளர்
            "bell",            // மணி
            "sandalBowl",      // சந்தணக் கிண்ணம்
            "sickle",          // கொடுவாள்
            "knife",           // கத்தி
            "woodenBoard",     // சனப் பலகை
            "fullPotOfWater",  // நிறைகுடம் தண்ணீர்
            "milk",            // பால்
            "curd",            // தயிர்
            "homium",          // ஹோமியம்
            "cowDung",         // சாணம்
            "deityPicture",    // சுவாமி படம்
            "mangoLeaf",       // மா இலை
            "brick",           // செங்கல்
            "sand",            // மணல்
            "firewood",        // சவுக்கு விறகு
            "hayDoll",         // வைக்கோல் பொம்மை
            "oldPaper",        // பழைய பேப்பர்
            "homaKundam",      // ஹோம குண்டம்
            "oneRupeeCoin"     // 1 ரூபாய் நாணயம்
        ],
        market: [
            "coconut",         // தேங்காய்
            "guava",           // கொய்யா
            "lotusFlower",     // தாமரைப் பூ
            "pumpkin",         // பூசணிக்காய்
            "sapota",          // சப்போட்டா
            "tulsi",           // துளசி
            "banana",          // வாழைப்பழம்
            "pomegranate",     // மாதுளை
            "oleander",        // அரளி
            "betelLeaf",       // வெற்றிலை
            "grapes",          // திராட்சை
            "looseFlowers",    // உதிரி பூ
            "bananaLeaf",      // வாழை இலை
            "neckGarland",     // கழுத்து மாலை
            "maruguHerb",      // மருகு
            "lemon",           // எலுமிச்சம்பழம்
            "moonGarland",     // நிலவு மாலை
            "bermudaGrass",    // அருகம்புல்
            "apple",           // ஆப்பிள்
            "deityGarland",    // சாமிபட மாலை
            "orange",          // ஆரஞ்சு
            "flowerString",    // தொடர் பூ
            "sweetLime",       // சாத்துக்குடி
            "jasmineString"    // மல்லித்தொடர்
        ]
    };


    // Merge both arrays for display in two columns
    const maxLen = Math.max(items.home.length, items.market.length, Items.home.length, Items.market.length);
    const rows = Array.from({ length: maxLen }, (_, i) => ({
        home: items.home[i] || "",
        market: items.market[i] || "",
        Home: Items.home[i] || "",
        Market: Items.market[i] || "",
    }));

    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (item, value) => {
        setInputs(prev => ({ ...prev, [item]: value }));
    };

    const handleConfirm = async () => {
        // Build homeProducts and marketProducts objects
        const homeProducts = {};
        const marketProducts = {};

        // Map home product keys
        Items.home.forEach((key) => {
            homeProducts[key.charAt(0).toLowerCase() + key.slice(1)] = inputs[key] || "";
        });

        // Map market product keys
        Items.market.forEach((key) => {
            marketProducts[key.charAt(0).toLowerCase() + key.slice(1)] = inputs[key] || "";
        });

        // Prepare the payload
        const payload = {
            userId: BookingDetails.userId, // Make sure userId is available in BookingDetails
            bookingId: BookingDetails.bookingId,
            homeProducts,
            marketProducts
        };

        try {
            setLoading(true);
            const response = await axios.post(`${ApiUrl}/api/product-list`, payload, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (response.status === 201) {
                Success('Requirement submitted successfully');
                onHide();
                setInputs({});
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time');
            } else if (status === 404) {
                Error('Invalid BookingId !');
            } else if (status === 400) {
                Error('Bad Request');
            } else if (status === 401) {
                Error('Session timed out');
                setTimeout(() => {
                    dispatch(logout());
                }, 200);
            } else {
                Error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && < Loader />}
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                size="lg"
                keyboard={false}
                contentClassName="modalView"
            >

                <Modal.Title className="title modalTitle">
                    {BookingDetails.selectedServices} Requirement
                </Modal.Title>

                <Modal.Body>
                    <div className="responsive-table-container">
                        <table >
                            <thead>
                                <tr>
                                    <th>பொருள் (வீடு)</th>
                                    <th>உள்ளீடு</th>
                                    <th>பொருள் (மார்க்கெட்)</th>
                                    <th>உள்ளீடு</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.home}</td>
                                        <td style={{ width: "150px" }}>
                                            {row.home && (
                                                <input
                                                    type="text"
                                                    value={inputs[row.Home] || ""}
                                                    onChange={e => handleInputChange(row.Home, e.target.value)}
                                                    className="form-control"
                                                />
                                            )}
                                        </td>
                                        <td>{row.market}</td>
                                        <td style={{ width: "150px" }}>
                                            {row.market && (
                                                <input
                                                    type="text"
                                                    value={inputs[row.Market] || ""}
                                                    onChange={e => handleInputChange(row.Market, e.target.value)}
                                                    className="form-control"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="modalClose"
                        onClick={onHide}
                        disabled={loading}
                    >
                        Close
                    </button>
                    <button
                        style={{
                            padding: "4px 10px",
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};