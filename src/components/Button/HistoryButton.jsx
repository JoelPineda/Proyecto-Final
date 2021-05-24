// importar React
import React from "react";
import PropTypes from "prop-types";
import "./Button.css";
import { GetCssByCompany } from "../../CssbyCompany/CommonCSS";

const HistoryButton = ({ clickHandler }) => (
  <>
    <a
      id="btnHistory"
      title="Atrás"
      Style={
        "margin-right: 12px !important; background-color:" +
        GetCssByCompany().PrimaryColor +
        ";"
      }
      className="unstyled-button icon fa-arrow-left"
      onClick={() => clickHandler()}
    ></a>
  </>
);

HistoryButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
};

export default HistoryButton;
