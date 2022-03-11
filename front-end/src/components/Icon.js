import React from 'react'

const Icon = ({text, img, alt, link}) => {
    return (

            <a href={link}>
            <img src={img} alt={alt}/>
            <h3>{text}</h3>
            </a>
    )
}


Button.propTypes = {
    text: PropTypes.string,
    img: PropTypes.string,
    alt: PropTypes.string,
    link: PropTypes.string,
}
export default Icons
