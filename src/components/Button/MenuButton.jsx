import React from 'react'
import PropTypes from 'prop-types'

const MenuButton = ({type, url, text}) => (
    <>
    <i className={"iconColor fa " + type}>
        <a href={url}>
            <span>{text}</span>
        </a>
    </i>
    <br />
    </>

)

MenuButton.propTypes = {
    type: PropTypes.string,
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired

} 

export default MenuButton