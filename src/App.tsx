import './App.css';
import { Integration } from 'lit-ceramic-sdk';
import { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";

function App() {
  let litCeramicIntegration = new Integration('https://ceramic-clay.3boxlabs.com', 'polygon')

  let streamID = 'kjzl6cwe1jw1479rnblkk5u43ivxkuo29i4efdx1e7hk94qrhjl0d4u0dyys1au' // test data

  const updateAlert = (status: string, message: string) => {
    const alert = document.getElementById('alerts')

    if (alert !== null) {
      alert.textContent = message
      alert.classList.add(`alert-${status}`)
      alert.classList.remove('hide')
      setTimeout(() => {
        alert.classList.add('hide')
      }, 5000)
    }
  };

  const updateStreamID = (resp: string | String) => {
    let streamID = resp;
    console.log('you now have this as your streamID', streamID)
    // @ts-ignore
    document.getElementById('stream').innerText = resp
  };

  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContent.........')
    litCeramicIntegration.startLitClient(window)
  });

  document.getElementById('readCeramic')?.addEventListener('click', () => {
    if (document.getElementById('stream') === null) {
      updateAlert('danger', `Error, please write to ceramic first so a stream can be read`)
    } else {
      // @ts-ignore
      console.log('this is the streamID youre sending: ', streamID)
      const response = litCeramicIntegration.readAndDecrypt(streamID).then(
        (value: string) =>
          // @ts-ignore
          (document.getElementById('decryption').innerText = value)
      )
      console.log(response)
    }
  });

  // encrypt with Lit and write to ceramic

  document.getElementById('encryptLit')?.addEventListener('click', function () {
    console.log('chain in litCeramicIntegration: ', litCeramicIntegration.chain)
    // @ts-ignore
    const stringToEncrypt = document.getElementById('secret').value
    // User must posess at least 0.000001 ETH on eth
    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '1000000000000',
        },
      },
    ]
    const response = litCeramicIntegration
      .encryptAndWrite(stringToEncrypt, accessControlConditions)
      .then((value: string | String) => updateStreamID(value))
    console.log(response)
  });
  const [selfID, setSelfID] = useState(null);
  const [setShowFriend] = useState("");
  const [selfDIDClient, setSelfDIDClient] = useState("");
  const [selfCeramicClient, setSelfCeramicClient] = useState("");


  useEffect(() => {
    if (selfID) {
      setSelfDIDClient(selfID.did);
      setSelfCeramicClient(selfID.client.ceramic);
    }
  }, [selfID]);

  useEffect(() => {
    if (selfDIDClient) {
      console.log("selfDIDClient", selfDIDClient);
    }
    if (selfCeramicClient) {
      console.log("selfCeramicClient", selfCeramicClient);
    }
  }, [selfDIDClient, selfCeramicClient]);


  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton setSelfID={setSelfID} />
      </header>
    </div>
  );
}

export default App;