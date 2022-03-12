import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Nav() {
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
          <ul>
            <li>
              <img src="/green-dot.svg" alt="green-dot" />
            </li>
            <li>0b09...fdb7</li>
            <li>
              <img src="/chevron-down.svg" alt="chevron" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
