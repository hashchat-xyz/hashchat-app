
import { useConnection } from '@self.id/framework';
import { Integration } from 'lit-ceramic-sdk';
import React, { useState } from 'react';

const CHAIN = 'polygon';


function setAccessControlConditions(toAddr: string){
    return ([
         {
             contractAddress: '',
             standardContractType: '',
             CHAIN,
             method: '',
             parameters: [':userAddress'],
             returnValueTest: {
                 comparator: '=',
                 value: toAddr, 
             },
         },
     ]
     )
     
 };
 
 let litCeramicIntegration = new Integration('https://ceramic-clay.3boxlabs.com', CHAIN);
 litCeramicIntegration.startLitClient(window);
 
 
export async function writeEncryptedMsg(msg: string, toAddr: string ){
     const [connection] = useConnection();
     const [streamId, setStreamId] = React.useState(null);
 
     React.useEffect(() => {
        if (connection.status === 'connected') {
            const write = async () => {

                const accessControlConditions = setAccessControlConditions(toAddr);
                const _streamId = await litCeramicIntegration.encryptAndWrite(msg, accessControlConditions);
    
                setStreamId(_streamId);
                }
            write();
    } } ) };
