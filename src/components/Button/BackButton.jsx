import React from 'react';
import './Button.css';


const BackButton = ({To}) => (
    
    <i   className="main-header btn btn-outline-danger icon fa-arrow-left">
        <a id="btnBack"  href={(To === undefined? "/" : To)}>
        <span>Regresar</span>  
        </a>
    </i>    
)

export default BackButton