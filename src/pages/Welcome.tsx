import { Box, Button, Text } from 'grommet';
import React, { useState } from 'react';
import metaLogo from "../images/meta.png";
import wcLogo from "../images/wc.png";

export default function Welcome() {
    const [walletOptions, setWalletOptions] = useState(false);

    const handleWalletOption = () => {
        setWalletOptions(true);
    }

    return (
        <Box align='center'>
            <Text size='5xl'>Welcome to <b>HashChat</b></Text><br />
            <Text>Hashchat is an encrypted, cross-chain messaging platform.</Text>

            <div className='welcome-btns'>
                {walletOptions ?
                    (<div>
                        <Button primary icon={<img src={metaLogo} alt="meta logo" />} gap='large' color={"#F6851B"} label="connect to metamask" margin={"small"} />

                        <Button primary label=" Use Walletconnect" color={"#4099FF"} icon={<img src={wcLogo} alt="meta logo" />} margin={"small"} />

                    </div>) :
                    <Button primary label="Connect your wallet" alignSelf='center' color={"#00BFFF"} onClick={handleWalletOption} margin="small" />}
            </div>
        </Box>

    )
}
