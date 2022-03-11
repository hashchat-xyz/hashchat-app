import React from 'react'
import greenDot from '../img/green-dot.svg'
import chevronDown from '../img/chevron-down.svg'

const Wallet = () => {
    return (

    <div class="wallet">
        <ul>
            <li> <img src={greenDot} alt="green-dot"/> </li>
            <li>0b09...fdb7</li>
            <li><img src={chevronDown} alt="chevron"/></li>
        </ul>
    </div>

    )
}

export default Wallet
