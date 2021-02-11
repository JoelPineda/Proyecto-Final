import React from 'react';
import './Button.css';
import  {GetCssByCompany} from "../../CssbyCompany/CommonCSS";


const BackButton = ({To}) => (
    
    <i Style={'background-color:' + GetCssByCompany().PrimaryColor + ';'} className="btn btn-outline-danger icon fa-arrow-left">
        <a id="btnBack"  href={(To === undefined? "/" : To)}>
        <span>Regresar</span>  
        </a>
    </i>    
)

export default BackButton