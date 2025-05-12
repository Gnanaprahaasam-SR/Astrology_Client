
import { useState } from "react";

const useForm = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event) => {
        setValue({
            ...value,
            [event.target.name]: event.target.value
        })
    }
    const reset = () => {
        setValue(initialValue);
    };

    const setValues = (newValues) => {
        setValue((prev) => ({ ...prev, ...newValues }));
    };

    return { value, handleChange, reset, setValues };
}

export default useForm;