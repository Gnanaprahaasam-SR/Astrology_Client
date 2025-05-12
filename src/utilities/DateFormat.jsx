
import { parse, format } from 'date-fns';

export const formateDate = (dateStr) => {
    const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
}

export const dateView = (dateStr) => {
    const parsedDate = parse(dateStr, 'yyyy-MM-dd', new Date());
    return format(parsedDate, 'MMMM d, yyyy');
}