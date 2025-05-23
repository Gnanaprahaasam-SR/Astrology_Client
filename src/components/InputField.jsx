import React, { useState } from 'react';
import "../App.css";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const InputField = (
    {
        group,
        label,
        labelClassName,
        value,
        type,
        className,
        onChange,
        errorMessage,
        placeholder,
        pattern,
        important,
        maxLength,
        ...props
    }) => {

    const [localError, setLocalError] = useState('');

    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        // Check character limit
        if (inputValue.length > maxLength) {
            setLocalError(`Maximum ${maxLength} characters allowed`);
        } else {
            setLocalError('');
        }

        if (inputValue.length <= maxLength) {
            onChange(e);
        }
    };
    return (
        <div className={group}>
            <label className={labelClassName}>
                {label} {important && <span className=''>*</span>}
            </label>
            <input
                type={type}
                className={className}
                value={value}
                placeholder={placeholder}
                onChange={handleInputChange}
                pattern={pattern?.toString()}
                maxLength={Number(maxLength) + 1}

                {...props}
            />
            {localError && <span className="d-block text-warning ps-2">{localError}</span>
            }
            {errorMessage && <span className=" d-block ps-2 text-warning" >{errorMessage}</span>}
        </div>
    );

}

export default InputField;



export const PasswordField = ({
    group,
    label,
    labelClassName,
    value,
    type,
    className,
    onChange,
    errorMessage,
    placeholder,
    ...props
}) => {

    const [view, setView] = useState(false);


    return (
        <div className={group}>
            <label className={labelClassName}>{label}</label>
            <div className='position-relative'>
                <input
                    type={view ? "text" : "password"}
                    className={className}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$"
                    {...props}
                />
                <button className="password-icon" type="button" onClick={() => setView(!view)} aria-label={view ? "Hide password" : "Show password"}>
                    {view ? <VscEye size={18} /> : <VscEyeClosed size={18} />}
                </button>
            </div>
            {errorMessage && <span className='text-warning mx-2'>{errorMessage}</span>}
        </div>
    );

}