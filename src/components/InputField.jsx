import React from 'react';
import "../App.css";

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
        ...props
    }) => {
    return (
        <div className={group}>
            <label className={labelClassName}>{label}</label>
            <input
                type={type}
                className={className}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                pattern={pattern ? pattern.toString() : undefined}
                {...props}
            />
            {errorMessage && <p style={{ color: 'red' }} >{errorMessage}</p>}
        </div>
    );

}

export default InputField;