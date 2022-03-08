import { AvatarPlaceholder, useConnection } from '@self.id/framework';
import { Anchor, Box, Heading, Paragraph } from 'grommet';
import React from 'react';
import { Integration } from 'lit-ceramic-sdk';

import ConnectButton from './ConnectButton';

const CHAIN = 'polygon';
const accessControlConditions = [
    {
        contractAddress: '',
        standardContractType: '',
        CHAIN,
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
            comparator: '=',
            value: '0xbeb5a64793ec486b080063d3b662f2131fac0f52', // codynhat.eth
        },
    },
];

export default function App() {
    const [connection] = useConnection();
    const [streamId, setStreamId] = React.useState(null);

    let litCeramicIntegration = new Integration('https://ceramic-clay.3boxlabs.com', CHAIN);
    litCeramicIntegration.startLitClient(window);

    React.useEffect(() => {
        if (connection.status === 'connected') {
            const write = async () => {
                const stringToEncrypt = 'This is what we want to encrypt on Lit and then store on ceramic';
                const _streamId = await litCeramicIntegration.encryptAndWrite(stringToEncrypt, accessControlConditions);

                setStreamId(_streamId);
            };

            write();
        }
    }, [connection]);

    return (
        <Box align="center" flex pad="large">
            <Heading>Self.ID example app</Heading>
            <Box pad="medium">
                <AvatarPlaceholder
                    did={connection.status === 'connected' ? connection.selfID.id : 'self.id'}
                    size={120}
                />
            </Box>
            <ConnectButton />
            <Paragraph>
                Learn more about the{' '}
                <Anchor href="https://developers.ceramic.network/tools/self-id/overview/">Self.ID SDK</Anchor>.
            </Paragraph>
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
