import { useConnection } from '@self.id/framework'
import { Anchor, Button, Paragraph } from 'grommet'
import React, { useEffect } from 'react'


export default function ConnectButton() {
  const [connection, connect, disconnect] = useConnection()

  return connection.status === 'connected' ? (
    <div>
      <Button
        label={`Disconnect`}
        onClick={() => {
          disconnect()
        }}
      />
      <div>${connection.selfID.id}</div>
    </div>
  ) : 'ethereum' in window ? (
    <Button
      disabled={connection.status === 'connecting'}
      label="Connect"
      onClick={() => {
        connect()
      }}
    />
  ) : (
    <Paragraph>
      An injected Ethereum provider such as <Anchor href="https://metamask.io/">MetaMask</Anchor> is
      needed to authenticate.
    </Paragraph>
  )
}
