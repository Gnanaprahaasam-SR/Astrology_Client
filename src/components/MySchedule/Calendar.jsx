import React, { useCallback, useEffect, useState } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./Calendar.css";
import { dateView } from "../../utilities/DateFormat";
import { IoIosArrowBack, IoIosArrowForward, IoIosCalendar } from "react-icons/io";
import { GoDotFill } from "react-icons/go";

const localizer = momentLocalizer(moment)


const MyCalendar = (props) => {
    const [allEvent, setAllEvent] = useState(props.event || []);

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [events, setEvents] = React.useState(props.event || []);
    const [range, setRange] = React.useState({
        start: new Date(),
        end: new Date()
    });

    const handleViewChange = (newView) => {
        setView(newView);
    };

    useEffect(() => {
        setAllEvent(props.event || []);
        setEvents(props.event || []);
    }, [props.event]);


    const handleRangeChange = (range) => {
        let start, end;
        if (Array.isArray(range)) {
            // Week view: range is [startDate, ..., endDate]
            start = range[0];
            end = range[range.length - 1];
        } else {
            // Month/Day view: range is {start, end}
            start = range.start;
            end = range.end;
        }
        setRange({ start, end });

        // Filter events to only those in the visible range
        const filtered = allEvent.filter((event) =>
            new Date(event.start) >= start && new Date(event.end) <= end
        );
        setEvents(filtered);
    };

    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    const serviceClassMap = {
        Jathagam: 'jathagamClass',
        Prasanam: 'prasanamClass',
        Vastu: 'vastuClass',
        Homam: 'homamClass',
    };

    const eventPropGetter = useCallback((event, start, end, isSelected) => {
        let className = '';
        // Assign class based on service
        if (event.service) {
            const foundKey = Object.keys(serviceClassMap).find(key =>
                event.service.toLowerCase().includes(key.toLowerCase())
            );
            if (foundKey) {
                className = serviceClassMap[foundKey];
            }
        }
        return { className: className.trim() };
    }, []);


    return (
        <div className="m-4">
            <div className="d-flex align-items-center justify-content-between">
                <div >
                    <div className="button-group d-flex align-items-center gap-2 mb-2">
                        <button onClick={() => setDate(new Date())} className="current-range">{dateView(new Date().toISOString().split("T")[0])}</button>
                        <button onClick={() => setDate(prev => moment(prev).subtract(1, view).toDate())} className="range-btn"><IoIosArrowBack size={18}/></button>
                        <button onClick={() => setDate(prev => moment(prev).add(1, view).toDate())} className="range-btn"><IoIosArrowForward size={18} /></button>
                    </div>
                    <div className="calendar-view ">
                        <label htmlFor="calendar-view" ><IoIosCalendar size={20} color="red" /></label>
                        <select
                            id="calendar-view"
                            value={view}
                            onChange={e => setView(e.target.value)}
                            className="drop-down"
                        >
                            <option value="month">Month</option>
                            <option value="week">Week</option>
                            <option value="day">Day</option>
                        </select>
                    </div>
                </div>

                <div className="d-block shadow-sm p-2 rounded-2 bg-white">
                    <div>
                        <GoDotFill style={{ color: "var(--Jathagam-color)" }} /> Jathagam
                    </div>
                    <div>
                        <GoDotFill style={{ color: "var(--Prasanam-color)" }} /> Prasanama
                    </div>
                    <div>
                        <GoDotFill style={{ color: "var(--Vastu-color)" }} /> Vastu
                    </div>
                    <div>
                        <GoDotFill style={{ color: "var(--Homam-color)" }} /> Homam
                    </div>
                </div>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "600px" }}
                defaultView={'week'}
                defaultDate={new Date()}
                date={date}
                timeslots={4}
                step={15}
                views={['month', 'week', 'day']}
                view={view}
                onView={handleViewChange}
                onRangeChange={handleRangeChange}
                onNavigate={handleNavigate}
                eventPropGetter={eventPropGetter}
            />
        </div>)
}

export default MyCalendar;