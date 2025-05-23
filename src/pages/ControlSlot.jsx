import { useEffect, useMemo, useState } from "react";
import Loader from "../components/Loader";
import axios from "axios";
import { Error, Success } from "../components/Alert";
import Modal from 'react-bootstrap/Modal';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import useForm from "../components/useForm";
import { logout } from "../redux/userInfo/userInfo";
import { useDispatch } from "react-redux";
import { convertTo12HourFormat, formateDate } from "../utilities/DateFormat";


const ApiUrl = import.meta.env.VITE_APP_SERVER;

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const AddBlockSlot = ({ show, onHide }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const { value: BlockDetials, setValues, reset, handleChange } = useForm({
        fromDate: "",
        toDate: "",
        startTime: "",
        endTime: "",
        reason: ""
    });

    const handleClose = () => {
        reset();
        onHide();
    }

    const handleSlotBooking = async () => {
        console.log(BlockDetials);

        setLoading(true);
        try {
            const response = await axios.post(`${ApiUrl}/api/insertBlockSlots`,
                {
                    fromDate: formatDate(BlockDetials.fromDate),
                    toDate: formatDate(BlockDetials.toDate),
                    startTime: BlockDetials.startTime,
                    endTime: BlockDetials.endTime,
                    reason: BlockDetials.reason
                }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log(response)
            if (response.status === 201) {
                Success("Slot blocked successfully!");
                handleClose();
            }
        } catch (error) {
            // console.log(error.message || 'Failed to fetch bookings');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            } else if (status === 409) {
                Error('Slot is not available')
            } else if (status === 401) {
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

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                centered
                size="md"
                keyboard={false}
                contentClassName="modalView px-4 pt-4"

            >

                <Modal.Title className="title modalTitle">
                    Block - Slot Booking
                </Modal.Title>

                <Modal.Body>
                    <div className="row d-flex">
                        <div className="col-6 mb-3">
                            <label htmlFor="fromDate">From Date</label>
                            <input
                                type="date"
                                className="inputField"
                                name="fromDate"
                                value={BlockDetials.fromDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="fromDate">To Date</label>
                            <input type="date"
                                className="inputField"
                                name="toDate"
                                value={BlockDetials.toDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="Start Time">Start Time</label>
                            <input type="time"
                                className="inputField"
                                name="startTime"
                                value={BlockDetials.startTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-6 mb-3">
                            <label htmlFor="End Time">End Time</label>
                            <input type="time"
                                className="inputField"
                                name="endTime" value={BlockDetials.endTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="End Time">Reason</label>
                            <input type="text"
                                className="inputField"
                                name="reason" value={BlockDetials.reason}
                                onChange={handleChange} maxLength={255}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="modalClose" onClick={handleClose} disabled={loading}>
                        Close
                    </button>
                    <button style={{
                        padding: "4px 10px",
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                    }} onClick={handleSlotBooking} disabled={loading}>
                        Confirm Block
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}


export const CancelBlockSlot = ({ show, onHide, BlockSlotDetails }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const handlecancel = async () => {
        try {
            setLoading(true);
            const response = await axios.delete(`${ApiUrl}/api/cancelBlockSlot`, {
                data: { id: BlockSlotDetails.id },
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            // console.log(response)
            if (response.status === 200) {
                Success('Block Slot is removed successfully');
                onHide();
            }
        } catch (error) {
            console.log(error.message || 'Failed to update blockSlot');
            const status = error.response?.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            } else if (status === 404) {
                Error('BlockSlot Cancel failed !')
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
                <Modal.Title className="title modalTitle">Cancel Block Slot</Modal.Title>

                <Modal.Body>
                    <p className="text-center">Are you sure you want to cancel {BlockSlotDetails.reason} Slot  ? </p>
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
                    }} onClick={handlecancel} disabled={loading}>
                        Cancel Block Slot
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


const ControlSlot = () => {

    const [blockSlots, setBlockSlots] = useState([]);
    const [search, setSearch] = useState("");
    const [cancelBlock, setCancelBlock] = useState(false);
    const [addBlockSlot, setAddBlockSlot] = useState(false);
    const [currentBlockSlot, setCurrentBlockSlot] = useState({});


    // Pagination state
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const fetchBlockSlot = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ApiUrl}/api/allBlockedSlots`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log(response.data?.blockedSlots)
            if (response.status === 200) {
                const sortedData = response.data?.blockedSlots;
                const fetchData = sortedData.map((data) => ({
                    id: data._id,
                    fromDate: formateDate(data.fromDate),
                    toDate: formateDate(data.toDate),
                    startTime: data.startTime,
                    endTime: data.endTime,
                    reason: data.reason
                }));
                setBlockSlots(fetchData)
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
                }, 200);
            }
            else {
                Error('Something went wrong')
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBlockSlot();
    }, []);



    // Filter blocks by search
    const filteredBlocks = useMemo(() => {
        if (!search) return blockSlots;
        const lower = search.toLowerCase();
        return blockSlots.filter(b =>
            (b.reason && b.reason.toLowerCase().includes(lower)) ||
            (b.fromDate && b.fromDate.toLowerCase().includes(lower)) ||
            (b.toDate && b.toDate.toLowerCase().includes(lower))

        );
    }, [search, blockSlots]);


    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const endIndex = Math.min(startIndex + rowsPerPage - 1, filteredBlocks.length);

    // Pagination logic
    const totalPages = Math.ceil(filteredBlocks.length / rowsPerPage);
    const paginatedBlockSlot = filteredBlocks.slice(
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

    const handleCloseBlock = () => {
        setAddBlockSlot(false);
        setCancelBlock(false);
        fetchBlockSlot();
    }

    return (
        <div className=" my-5">
            {loading && <Loader />}

            <div className="container table-bg p-2 rounded-4 " >

                <div className=" flex align-items-center justify-content-right">
                    <button onClick={() => setAddBlockSlot(true)} className="slotButton">Add Slot</button>
                    <input
                        type="search"
                        placeholder=" Search..."
                        value={search}
                        onChange={handleSearch}
                        className="search"
                    />
                </div>
                {/* Table */}
                <div className="responsive-table-container">
                    <table className="" >
                        <thead>
                            <tr style={{ background: "rgba(58, 57, 57, 0.3)" }}>
                                {/* <th>User ID</th> */}
                                <th style={{ whiteSpace: "nowrap" }}>Reason</th>
                                <th style={{ whiteSpace: "nowrap" }}>Block Slot Booking Details</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBlockSlot.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                                        No Block Slot Details Found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedBlockSlot.map((blockSlot, idx) => (
                                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                        <td>{blockSlot.reason}</td>

                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <div>{blockSlot.fromDate} - {blockSlot.toDate}</div>
                                            ({convertTo12HourFormat(blockSlot.startTime)} - {convertTo12HourFormat(blockSlot.endTime)})
                                        </td>

                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <button
                                                className="cancel-btn"
                                                onClick={() => { setCancelBlock(true); setCurrentBlockSlot(blockSlot); }}
                                                title="Cancel"
                                            >
                                                <ImCancelCircle size={18} />
                                            </button>
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
                            {startIndex} – {endIndex} of {filteredBlocks.length}
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
            <AddBlockSlot onHide={handleCloseBlock} show={addBlockSlot} />
            <CancelBlockSlot onHide={handleCloseBlock} show={cancelBlock} BlockSlotDetails={currentBlockSlot} />
        </div >
    );
}

export default ControlSlot;
