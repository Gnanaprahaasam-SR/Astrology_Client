
import { parse, format } from 'date-fns';

export const formateDate = (dateStr) => {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
}

export const dateView = (dateStr) => {
    const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
}


export const convertTo12HourFormat = (time24) => {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // convert '0' to '12'
    return `${hour}:${minute} ${ampm}`;
}