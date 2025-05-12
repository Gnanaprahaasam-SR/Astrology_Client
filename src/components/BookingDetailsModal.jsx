
import { useRef } from "react";
import { Modal } from "react-bootstrap";
import { formateDate } from "../utilities/DateFormat";
import { useTranslation } from "react-i18next";


const BookingDetails = ({ bookingData, show, onHide }) => {

    const componentRef = useRef();
    const { t } = useTranslation();
    const handlePrint = () => {
        const printWindow = window.open("Booking Detials", "_blank");
        const printContents = componentRef.current.innerHTML;

        printWindow.document.write(`
            <html>
                <head>
                    <style>
                        body {padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
            `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();

    };

    const serviceMap = {
        analyzeHoroscope: t("service.analyze_horoscope"),
        writeHoroscope: t("service.write_horoscope"),
        vethalaiPrasanam: t("service.vethalaiPrasanam"),
        sooliPrasanam: t("service.sooliPrasanam"),
        kulatheivaPrasanam: t("service.kulatheivaPrasanam"),
        astamangalaPrasanam: t("service.astamangalaPrasanam"),
        ganapathyHomam: t("service.ganapathy_homam"),
        kirahaPrethesam: t("service.kiraha_prethesam"),
        marriage: t("service.marriage"),
        kumbaAbishegam: t("service.kumba_abishegam"),
        sudarshanaHomam: t("service.sudarshana_homam"),
        mahalakshmiHomam: t("service.mahalakshmi_homam"),
        chandiHomam: t("service.chandi_homam"),
        navaGrahamHomam: t("service.nava_graham_homam"),
        pariharaHomam: t("service.parihara_homam"),
        ayushHomam: t("service.ayush_homam"),
    };

    <td>{serviceMap[bookingData.serviceType] || ""}</td>

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            centered
            contentClassName=" modalView"
        >
            <div ref={componentRef}>

                <Modal.Title className="title modalTitle">{t("service.bookingDetails")}</Modal.Title>

                <Modal.Body>

                    <table className="">
                        <tbody>
                            {bookingData?.bookingId && (
                                <tr>
                                    <th className="">{t("service.bookingId")}</th>
                                    <td>{bookingData.bookingId}</td>
                                </tr>
                            )}
                            {bookingData?.name && (
                                <tr>
                                    <th className="">{t("service.bookingPersonName")}</th>
                                    <td>{bookingData.name}</td>
                                </tr>
                            )}
                            {bookingData?.phone && (
                                <tr>
                                    <th>{t("service.phone")}</th>
                                    <td>{bookingData.phone}</td>
                                </tr>
                            )}
                            {bookingData?.address && (
                                <tr>
                                    <th>{t("service.address")}</th>
                                    <td>{bookingData.address}</td>
                                </tr>
                            )}
                            {/* {bookingData?.userId && (
                                <tr>
                                    <th>{t("service.userId")}</th>
                                    <td>{bookingData.userId}</td>
                                </tr>
                            )} */}
                            {bookingData?.selectedServices && (
                                <tr>
                                    <th>{t("service.service")}</th>
                                    <td>{bookingData.selectedServices === "Jathagam" ? t("service.serviceOne") : bookingData.selectedServices === "Prasanam" ? t("service.serviceTwo") : bookingData.selectedServices === "Vastu" ? t("service.serviceThree") : t("service.serviceFour")}</td>
                                </tr>
                            )}
                            {bookingData?.serviceType && (
                                <tr>
                                    <th>{t("service.serviceType")}</th>
                                    <td>{serviceMap[bookingData.serviceType] || ""}</td>
                                </tr>
                            )}
                            {bookingData?.date && (
                                <tr>
                                    <th>{t("service.date")}</th>
                                    <td>{formateDate(bookingData.date)}</td>
                                </tr>
                            )}
                            {bookingData?.timeSlots && (
                                <tr>
                                    <th>{t("service.timing")}</th>
                                    <td>
                                        {bookingData.timeSlots.map((slot, index) => (
                                            <span key={index}>
                                                {slot.startTime} - {slot.endTime}
                                                {index !== bookingData.timeSlots.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            )}
                            {bookingData?.bookingStatus && (
                                <tr>
                                    <th>{t("service.status")}</th>
                                    <td>{bookingData.bookingStatus === "Confirmed" ? t("service.confirmed") : bookingData.bookingStatus === "Pending" ? t("service.pending") : t("service.cancelled")}</td>
                                </tr>
                            )}
                            {bookingData?.mapLink && (
                                <tr>
                                    <th>{t("service.mapLink")}</th>
                                    <td>
                                        <a
                                            href={bookingData.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white"
                                        >
                                            View Location
                                        </a>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                    {!Object.values(bookingData).some(Boolean) && (
                        <p className="text-muted w-100">No booking details available</p>
                    )}
                </Modal.Body>
            </div>
            <div className="d-flex align-items-center justify-content-end mx-4 my-2">
                <button variant="secondary" className="modalClose" onClick={onHide}>
                    {t("service.close")}
                </button>
                <button variant="primary" className="modalPrint" onClick={handlePrint}>
                    {t("service.print")}
                </button>
            </div>


        </Modal>
    );
}

export default BookingDetails;