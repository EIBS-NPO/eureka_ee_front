import React from "react";

const Field = ({id, name, label, value, onChange, placeholder, type, error = ""}) => {
  return (
    <div className="">
        <label htmlFor={name}>{label}</label>
      <input
        id={id ? id : name}
        value={value ? value : null}
        onChange={onChange}
        type={type ? type : "text"}
        placeholder={placeholder}
        name={name}
        className={"form-control" + (error && " is-invalid")}
      />
      {error && <p className="invalid-feedback">{error}</p>}
    </div>
  );
};

export default Field;
