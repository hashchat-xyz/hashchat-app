import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ConnectButton from "./ConnectButton";

export default function Nav({
  selfID,
  setSelfID,
  ethProvider,
  setEthProvider,
}) {
  const router = useRouter();

  return (
    <div className="header">
      <div className="header-left">
        <input type="text" placeholder="Search Messages" id="search-bar" />
      </div>
      <div className="header-right">
        <div className="header-icons">
          <ul>
            <li className={router.pathname == "/start-chat" ? "active" : ""}>
              <Link href="/start-chat">Start Message</Link>
            </li>
            <li className={router.pathname == "/create" ? "active" : ""}>
              <Link href="/create">Create</Link>
            </li>
            <li className={router.pathname == "/inbox" ? "active" : ""}>
              <Link href="/inbox">Inbox</Link>
            </li>
          </ul>
        </div>
        <div className="wallet">
          <ConnectButton
            selfID={selfID}
            setSelfID={setSelfID}
            ethProvider={ethProvider}
            setEthProvider={setEthProvider}
          />
        </div>
      </div>
    </div>
  );
}
