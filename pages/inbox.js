import React from "react";
import Nav from "../components/Nav";

export default function Inbox() {
  return (
    <div>
      <Nav />

      <div className="body">
        <div className="all-profiles">
          <div className="profile">
            <img src="/user-profile.svg" alt="profile iocn" />
            <h4>steve.eth</h4>
            <p>11:15pm</p>
          </div>
          <div className="profile2">
            <img src="/user-profile.svg" alt="profile iocn" />
            <h4>rob.eth</h4>
            <p>10:20pm</p>
          </div>
          <div className="profile3">
            <img src="/user-profile.svg" alt="profile iocn" />
            <h4>brooke.eth</h4>
            <p>10:05pm</p>
          </div>
          <div className="profile4">
            <img src="/user-profile.svg" alt="profile iocn" />
            <h4>julia.eth</h4>
            <p>09:42pm</p>
          </div>
        </div>
        <div className="chat-wrapper">
          <div className="reciever-name">
            <h2>steve.eth</h2>
          </div>
          <div className="chat-contents">
            <div className="sent-message-1">
              <img src="/person.svg" alt="person" />
              <p>
                Vel et commodo et scelerisque aliquam. Sed libero, non praesent
                felis, sem eget venenatis neque. Massa tincidunt tempor a nisl
                eu mauris lectus.{" "}
              </p>
            </div>
            <div className="recieved-message-1">
              <img src="/person.svg" alt="person" />
              <p>
                Vel et commodo et scelerisque aliquam. Sed libero, non praesent
                felis, sem eget venenatis neque. Massa tincidunt tempor a nisl
                eu mauris lectus.{" "}
              </p>
            </div>
            <div className="sent-message-2">
              <img src="/person.svg" alt="person" />
              <p>
                Vel et commodo et scelerisque aliquam. Sed libero, non praesent
                felis, sem eget venenatis neque. Massa tincidunt tempor a nisl
                eu mauris lectus.{" "}
              </p>
            </div>
            <div className="recieved-message-2">
              <img src="/person.svg" alt="person" />
              <p>
                Vel et commodo et scelerisque aliquam. Sed libero, non praesent
                felis, sem eget venenatis neque. Massa tincidunt tempor a nisl
                eu mauris lectus.{" "}
              </p>
            </div>
          </div>
          <div className="send-message">
            <input type="text" placeholder="Enter Message" id="search-bar" />
            <img src="/send-button.svg" alt="send-button" />
          </div>
        </div>
      </div>
    </div>
  );
}
