import PropTypes from 'prop-types'


const Button = ({text, onClick}) => {
    return (
        <button variant='outlined'  className='header-icons'> 
        {text} 
        </button>
    )
}


Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
}

export default Button
