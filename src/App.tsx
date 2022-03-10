import { AvatarPlaceholder, useConnection } from '@self.id/framework';
import { Anchor, Box, Heading, Paragraph } from 'grommet';
import React, { useRef } from 'react';

import ConnectButton from './ConnectButton';
import FormAndSendMsg from './FormAndSendMsg';

export default function App() {
    const [connection] = useConnection();
    const [streamId, setStreamId] = React.useState(null);

    return (
        <Box align="center" flex pad="large">
            <Heading>Hashchat app Alpha</Heading>
            <Box pad="medium">
                <AvatarPlaceholder
                    did={connection.status === 'connected' ? connection.selfID.id : 'self.id'}
                    size={120}
                />
            </Box>
            <ConnectButton />

            <FormAndSendMsg />

            <Paragraph>
                {streamId ? (
                    <a
                        href={`https://documint.net/${streamId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-light"
                    >
                        View Encrypted Stream
                    </a>
                ) : null}
            </Paragraph>
        </Box>
    );

}
