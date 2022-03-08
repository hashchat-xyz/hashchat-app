import { Button } from 'grommet';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { setAccessControlConditions } from './utils';
import { useConnection } from '@self.id/framework';
import { Integration } from 'lit-ceramic-sdk';

const CHAIN = 'polygon';

 
export default function FormAndSendMsg() {
    const [toAddr, setAddr] = useState('');
    const [msg, setMsg] = useState('');
    const [connection] = useConnection();
    const [streamId, setStreamId] = React.useState(null);

    let litCeramicIntegration = new Integration('https://ceramic-clay.3boxlabs.com', CHAIN);
    litCeramicIntegration.startLitClient(window);

    const write = async () => {

        const accessControlConditions = setAccessControlConditions(toAddr);
        const streamId = await litCeramicIntegration.encryptAndWrite(msg, accessControlConditions);

        setStreamId(streamId);
        };
        
    const isNotConnected = (connection.status != 'connected');

    return (
        <>
            <Typography>
                'Enter to address (i.e. 0xfjkslaf or vitalik.eth) and enter your message to send'
            </Typography>
            <div>
                <TextField
                    autoFocus
                    disabled={isNotConnected}
                    fullWidth
                    id="toAddr"
                    label="toAddr"
                    onChange={(event: { target: { value: any; }; }) => setAddr(event.target.value)}
                    placeholder="Address"
                    type="text"
                    value={toAddr}
                    variant="standard" />
                <TextField
                    autoFocus
                    disabled={isNotConnected}
                    fullWidth
                    id="msg"
                    label="msg"
                    onChange={(event) => setMsg(event.target.value)}
                    placeholder="Enter your message here"
                    type="text"
                    value={msg}
                    variant="standard" />
            </div>
            <Button
                color="primary"
                onClick={() => write()}
                >
                ENCRYPT AND SEND
            </Button>
        </>
    );
}