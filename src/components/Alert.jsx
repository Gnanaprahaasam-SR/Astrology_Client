import { toast } from 'react-toastify';

export const Success = (message) => {
    toast.success(message, {
        type: "success",
        position: "top-right",
        pauseOnHover: true,
        draggable: true,
        theme: "colored",

    });
};

export const Error = (message) => {
    toast.error(message, {
        type: "error",
        position: "top-right",
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
    });
};

export const Info = (message) => {
    toast.info(message, {
        type: "warning",
        position: "top-right",
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
    });
};

export const Warring = (message) => {
    toast.warn(message, {
        type: "warning",
        position: "top-right",
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
    });
};

