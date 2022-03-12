import Link from "next/link";
import React from "react";
import Nav from "../components/Nav";

export default function StartChat() {
  return (
    <div>
      <Nav />

      <div className="main">
        <div className="overlay">
          <div className="main-text">
            <h1>Start a new conversation.</h1>
          </div>
          <div className="main-icons">
            <div className="main-icon-left">
              <Link href="/direct-message">
                <div>
                  <img src="/person.svg" alt="person" />
                  <h3>Message</h3>
                </div>
              </Link>
            </div>
            <div className="main-icon-right">
              <Link href="/group-chat">
                <div>
                  <img src="/people.svg" alt="people" />
                  <h3>Groupchat</h3>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
