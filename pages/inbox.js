import React from "react";
import Nav from "../components/Nav";
import Threads from "../components/Threads";

export default function Inbox({
  selfID,
  setSelfID,
  ethProvider,
  setEthProvider,
}) {
  return (
    <div>
      <Nav
        selfID={selfID}
        setSelfID={setSelfID}
        ethProvider={ethProvider}
        setEthProvider={setEthProvider}
      />

      <Threads selfID={selfID} ethProvider={ethProvider}></Threads>
    </div>
  );
}
