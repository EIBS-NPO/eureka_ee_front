import React from 'react';

const Select = ({id, name, label, value, error, onChange, children, disabled, hidden }) => {
    return (
        <div className="form-group">
            <label htmlFor={name} className="mr-1">{label}</label>
            <select
                onChange={onChange}
                name={name}
                id={id ? id : name}
                value={value ? value : undefined}
                className={"form-control " + (error && " is-invalid")}
                disabled = {!!disabled}
                hidden = {!!hidden}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
    );
}


export default Select;