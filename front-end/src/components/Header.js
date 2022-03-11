import React from 'react'
import SearchBox from './SearchBox'
import Button from './Button'
import Wallet from './Wallet'

const Header = () => {
    return (
        <header className="header">
        <SearchBox/>
        <div class="header-right">
            <div class="header-icons">
                <ul>
                    <li><Button text = 'Message' /></li>
                    <li><Button text = 'Create' /></li>
                    <li><Button text = 'Explore' /></li>
                </ul>
            </div>
        <Wallet/>
        </div>
        </header>
        
    )
}

export default Header

