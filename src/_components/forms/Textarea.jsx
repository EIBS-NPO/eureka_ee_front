import React from "react";

// besoin : -name
//           -label
//          - value
//           -onChange
//          -placeholder
//          -type
//          -error
//          -rows
//          -cols

const Textarea = ({
    name,
    label,
    value,
    onChange,
    placeholder,
    error = "",
    rows = 5,
    cols = 33,
    disabled = false
}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                name={name}
                id={name}
                className={"form-control" + (error && " is-invalid")}
                rows={rows}
                cols={cols}
                disabled={disabled}
            />
            {error && <p className="invalid-feedback">{error}</p>}
        </div>
    );
};

export default Textarea;
