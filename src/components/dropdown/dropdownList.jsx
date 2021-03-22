import React from "react";
import Select from "react-select";
import "./dropdown.css";

const DropdownList = ({
  data,
  handleChange,
  idControl,
  headerLabel,
  defaultValue,
}) => (
  <>
    <div className="container">
      <div className="row">
        <div className="form-group col-md-12">
          <label htmlFor={idControl}>{headerLabel}</label>
          <Select
            placeholder=" Seleccione..."
            name={idControl}
            options={data}
            defaultValue={defaultValue}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  </>
);
export default DropdownList;
