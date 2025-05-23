import InputField from "../components/InputField";
import { useNavigate, useParams } from "react-router-dom";
import useForm from "../components/useForm";
import "../App.css";
import Select from 'react-select';
import { IoCaretBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userInfo/userInfo";
const ApiUrl = import.meta.env.VITE_APP_SERVER;
import { Error, Success, Warring } from "../components/Alert";
import { useTranslation } from "react-i18next";
import Loader from "../components/Loader";


const customStyles = {
    control: (base, state) => ({
        ...base,
        border: state.isFocused ? "2px solid #ffc44a" : state.isHover ? "2px solid rgb(204, 204, 204, .6)" : "2px solid rgb(204, 204, 204, .6)",
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
        maxHeight: 150,
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

const JathagamService = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const userDetails = useSelector((state) => state.user?.user)
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const PrasanamOptions = [
        { value: 'analyzeHoroscope', label: t("service.analyze_horoscope") },
        { value: 'writeHoroscope', label: t('service.write_horoscope') },
        { value: 'horoscopeMatching', label: t("service.horoscope_Matching") },
    ]


    const { value: bookingDetails, handleChange, setValues, reset } = useForm({
        userName: "",
        mobile: "",
        address: "",
        service: "Jathagam",
        type: "analyzeHoroscope",
        count: 1,
        bookingDate: new Date().toISOString().split("T")[0],
        time: [],
        cost: '',
        document: []
    });
    // console.log(bookingDetails)

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve("");
        });
    }

    const [imagePreviews, setImagePreviews] = useState([]);

    const [loading, setLoading] = useState(false);
    const [timeSlot, setTimeSlot] = useState([]);

    const handleTypeChange = (selectedOption) => {
        setValues({ type: selectedOption?.value || "" });
    };

    const handleTimeSelect = (slot) => {
        const slotObject = {
            startTime: slot.startTime,
            endTime: slot.endTime,
        };
        const currentTimes = bookingDetails.time;
        const slotString = `${slot.startTime} - ${slot.endTime}`;
        const isSelected = currentTimes.some(
            (time) => time.startTime === slot.startTime && time.endTime === slot.endTime
        );

        // Limit selection based on member count
        const memberCount = parseInt(bookingDetails.count, 10) || 0;

        if (isSelected) {
            setValues({
                time: currentTimes.filter(
                    (time) => time.startTime !== slot.startTime ||
                        time.endTime !== slot.endTime
                ),
            });
        } else {
            // Only allow selection if limit not reached
            if (currentTimes.length < memberCount) {
                setValues({
                    time: [...currentTimes, slotObject],
                });
            } else {
                // Optionally, show a message or notification to the user
                Warring(`You may choose up to ${memberCount} time slot(s) only. To select more, please update the booking count.`);
            }
        }
    };


    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`${ApiUrl}/api/available-slots`, {
                params: {
                    serviceId: "jathagam",
                    date: formatDate(bookingDetails?.bookingDate),
                },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            // console.log(response);

            if (response.status === 200) {
                setTimeSlot(response.data?.slots)
            }

        } catch (error) {
            // console.error("Error fetching available slots:", error);
            const status = error.response.status;
            if (status === 429) {
                Error('Too many Requests, Try for some other time')
            }
            else if (status === 401) {
                Error('Session timed out')
                setTimeout(() => {
                    dispatch(logout());
                }, 2000);
            } else {
                Error('Something went wrong')
            }
        }
    };


    useEffect(() => {
        if (bookingDetails?.bookingDate) {
            fetchAvailableSlots();
        }
    }, [bookingDetails?.bookingDate]);

    useEffect(() => {
        let newCost = "";
        if (bookingDetails.type === "analyzeHoroscope") {
            newCost = 500;
        } else if (bookingDetails.type === "writeHoroscope") {
            newCost = 2000;
        }
        else if (bookingDetails.type === "horoscopeMatching") {
            newCost = 200;
        }
        setValues({ cost: newCost * bookingDetails.count });
    }, [bookingDetails.count, bookingDetails.type]);


    const handleBooking = async () => {

        console.log(bookingDetails)

        if (bookingDetails.mobile.length < 10) {
            Warring("Give valid phone number");
            return;
        }

        if (bookingDetails.type !== "horoscopeMatching" && bookingDetails.time.length < bookingDetails.count) {
            Warring("Please select the Time Slot based on you booking count");
            return;
        }

        if (!bookingDetails.userName || !bookingDetails.mobile || !bookingDetails.address || !bookingDetails.bookingDate || !bookingDetails.count || !bookingDetails.type) {
            Error("All mandatory fields are required");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${ApiUrl}/api/book-slot`, {
                userId: userDetails._id,
                name: bookingDetails.userName,
                phone: bookingDetails.mobile,
                address: bookingDetails.address,
                selectedServices: bookingDetails.service,
                count: bookingDetails.count,
                date: formatDate(bookingDetails.bookingDate),
                timeSlots: bookingDetails.time,
                serviceType: bookingDetails.type,
                mapLink: "",
                bookingStatus: bookingDetails.type === "horoscopeMatching" ? "Pending" : "Confirmed",
                cost: bookingDetails.cost,
                document: bookingDetails.document,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            // console.log(response);

            if (response.status === 201) {
                Success('Booking Successfull');
                reset();
                handleTypeChange();
                fetchAvailableSlots();
                setValues({ cost: 500 });
                navigate("/Services", { replace: true })
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


    const handleImageChange = async (e) => {
        const newFiles = Array.from(e.target.files);

        const validFiles = newFiles.filter(file => {
            if (file.size <= 1040000) return true;
            Warring(`${file.name} exceeds the 500KB size limit and was not added.`);
            return false;
        });

        // Convert to base64 strings
        const newBase64Images = await Promise.all(
            validFiles.map(file => fileToBase64(file))
        );

        // Combine with existing images
        const allImages = [...bookingDetails.document, ...newBase64Images];

        // Optional: remove duplicates
        const uniqueImages = Array.from(new Set(allImages));

        // Optional: sort alphabetically by base64
        uniqueImages.sort((a, b) => a.localeCompare(b));

        setValues({ ...bookingDetails, document: uniqueImages });
        setImagePreviews(uniqueImages); // same as images
    };

    const handleDeleteImage = (index) => {
        const updatedImages = bookingDetails.document.filter((_, i) => i !== index);
        setValues({ ...bookingDetails, document: updatedImages });
        setImagePreviews(updatedImages);
    };

    return (
        <section className="booking ">
            {loading && <Loader />}
            <div className="container col-12 col-md-9 py-4 ">
                <div>
                    <button className="back-btn mb-3 text-danger" onClick={() => navigate(-1)}> <IoCaretBack /> {t('service.back')}</button>
                </div>

                <div className="row shadow p-4 m-1 rounded-4 booking-card">

                    <h2 className="title text-center mb-3">{t("service.jathagamBooking")}</h2>
                    <div className="col-12 col-sm-6 col-md-4">
                        <InputField
                            label={t("service.bookingName")}
                            type="text"
                            name="userName"
                            labelClassName=" fieldLabel"
                            placeholder={t("service.enterName")}
                            value={bookingDetails.userName}
                            onChange={handleChange}
                            className="inputField"
                            important={true}
                            maxLength={255}
                            required
                            group="inputGroup"
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-md-4">
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
                            important={true}
                            maxLength={10}
                            min={0}
                            required
                            group="inputGroup"
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-md-4 ">
                        <InputField
                            label={t("service.memberCount")}
                            type="number"
                            name="count"
                            labelClassName=" fieldLabel"
                            placeholder={t("service.enterCount")}
                            value={bookingDetails.count}
                            min={0}
                            max={13}
                            onChange={handleChange}
                            className="inputField"
                            required
                            group="inputGroup"
                            maxLength={2}
                            important={true}
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-md-4 mb-2">
                        <label htmlFor="serviceType" className="fieldLabel">
                            {t("service.selectServiceType")} <span className=''>*</span>
                        </label>
                        <Select
                            options={PrasanamOptions}
                            value={PrasanamOptions.find(opt => opt.value === bookingDetails.type)}
                            onChange={handleTypeChange}
                            styles={customStyles}
                            placeholder="Select a service"
                            isClearable={true}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4 ">
                        <InputField
                            label={t("service.serviceCost")}
                            type="number"
                            name="cost"
                            labelClassName="fieldLabel"
                            value={bookingDetails.cost}
                            onChange={handleChange}
                            className="inputField"
                            maxLength={6}
                            required
                            group="inputGroup"
                            disabled
                        />
                    </div>

                    <div className="col-12 col-sm-6 col-md-4 mb-3">
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
                        <label htmlFor="address" className="fieldLabel">{t("service.address")} <span className=''>*</span></label>
                        <textarea
                            name="address"
                            id="address"
                            value={bookingDetails.address}
                            onChange={handleChange}
                            className="inputField "
                            rows={3}
                        />
                    </div>
                    {bookingDetails.type === "horoscopeMatching" ?
                        <>
                            <div className="col-12 col-sm-6 col-md-4 mb-3">
                                <label htmlFor="document" className="fieldLabel">{t("service.horoscopeDocument")}</label>
                                <input type="file" name="document" accept="image/*" multiple className="inputField" onChange={handleImageChange} />
                            </div>
                            {imagePreviews.length > 0 && (
                                <div className="imagePreview" >
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} style={{ position: "relative" }}>
                                            <img
                                                src={src}
                                                alt={`Preview ${idx + 1}`}
                                                style={{ maxWidth: "120px", maxHeight: "120px", marginBottom: "15px" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(idx)}
                                                className="image-cancel"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </> :
                        <div className="col-12 ">
                            <label htmlFor="time" className="fieldLabel mb-2">{t("service.timeslots")}<span className=''>*</span></label>

                            <div className="d-flex flex-wrap justify-content-start row g-3">
                                {timeSlot.length > 0 ? (
                                    timeSlot.map((slot, index) => (
                                        <div className="col-lg-3 col-md-4 col-sm-4 col" key={index}>
                                            <button
                                                key={`${slot.startTime}-${slot.endTime}`}
                                                type="button"
                                                className={`w-100 ${slot.available ? 'availableSlot' : 'bookedSlot'}
                                         ${bookingDetails.time.some((time) =>
                                                    time.startTime === slot.startTime && time.endTime === slot.endTime) ? 'confirmbooking' : ''
                                                    }`}
                                                onClick={() => slot.available && handleTimeSelect(slot)}
                                                disabled={!slot.available}
                                            >
                                                {`${slot.startTime} - ${slot.endTime}`}
                                            </button>
                                        </div>

                                    ))
                                ) : (
                                    <p>{t("service.no-timeSlot")}</p>
                                )}
                            </div>
                        </div>
                    }
                    <div className="text-center">
                        <button className="submitButton " onClick={handleBooking}> {t("service.submit")}</button>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default JathagamService;
