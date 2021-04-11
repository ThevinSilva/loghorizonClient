import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Message from "../Message/Message";

import "./Messages.css";

const Messages = ({ messages, name, img, id }) => {
  return (
    <ScrollToBottom
      option={{ behavior: "smooth", color: "white" }}
      className="messages"
    >
      {messages.map((message, i) => (
        <div key={i}>
          <Message
            message={message}
            id={id}
            name={name}
            mesgType={"Dirrect Message"}
            img={img}
          />
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;
