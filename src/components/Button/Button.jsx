// importar React
import React from 'react'
import PropTypes from 'prop-types'
import './Button.css'
import  {GetCssByCompany} from "../../CssbyCompany/CommonCSS";

// Componente Funcional
const Button = ({type, text, clickHandler, isDisabled, data_prefix}) => (
    <button Style={'background-color:' + GetCssByCompany().PrimaryColor + ';'} className={type} disabled={(isDisabled ?? false)} data-prefix={(data_prefix ?? '')} onClick={() => clickHandler(text)}>
        <span>{text}</span>
    </button>
)

Button.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string.isRequired,
    clickHandler: PropTypes.func.isRequired
} 

export default Button