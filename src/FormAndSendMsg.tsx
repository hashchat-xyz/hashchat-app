import { Button } from 'grommet';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { writeEncryptedMsg } from './utils';

 
export default function FormAndSendMsg(): JSX.Element {
    const [toAddr, setAddr] = useState('');
    const [msg, setMsg] = useState('');


    return (
        <><Typography>
            'Enter to address (i.e. 0xfjkslaf or vitalik.eth) and enter your message to send'
        </Typography><div>
                <TextField
                    autoFocus
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
                    fullWidth
                    id="msg"
                    label="msg"
                    onChange={(event) => setMsg(event.target.value)}
                    placeholder="Enter your message here"
                    type="text"
                    value={msg}
                    variant="standard" />
            </div><Button
                color="primary"
                onClick={() => writeEncryptedMsg(toAddr, msg)}
                >
                ENCRYPT AND SEND
                </Button></>
    );
}
