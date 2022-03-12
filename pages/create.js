import React from "react";
import Nav from "../components/Nav";

export default function Create() {
  return (
    <div>
      <Nav />

      <div className="main">
        <div className="overlay">
          <div className="main-text">
            <h1>Create your community.</h1>
          </div>
          <div className="name">
            <h4>Name</h4>
            <input
              type="text"
              placeholder="Enter your community name."
              id="name-bar"
            />
          </div>
          <div className="blockchain">
            <h4>Select Blockchain</h4>
            <input
              type="text"
              placeholder="Enter your token’s blockchain.  "
              id="name-bar"
            />
          </div>
          <div className="token-name">
            <h4>Enter Token Address</h4>
            <input
              type="text"
              placeholder="Enter the full token address."
              id="name-bar"
            />
          </div>
          <div className="tokens-required">
            <h4>Number of Tokens Required</h4>
            <input
              type="text"
              placeholder="# of tokens required to join. "
              id="name-bar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
