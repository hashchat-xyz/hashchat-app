import Link from "next/link";
import React from "react";
import Nav from "../components/Nav";

export default function DirectMessage() {
  return (
    <div>
      <Nav />

      <div className="main">
        <div className="overlay">
          <div className="main-text">
            <h1>Send an encrypted message to this wallet address.</h1>
          </div>
          <div className="wallet-address">
            <input
              type="text"
              placeholder="Paste wallet address."
              id="search-bar"
            />
            <Link href="/inbox">
              <button id="enter-address-button">Enter</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
