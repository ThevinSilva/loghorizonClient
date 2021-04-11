import React, { useState, useEffect } from "react";
import ReactEmoji from "react-emoji";
import "./Message.css";
import { getDate } from "../../helper";

const Message = ({
  message: { user, text, type, id: messageID },
  name,
  id,
  mesgType,
  img,
}) => {
  /** @bug 0001 */

  if (type === "time") {
    if (messageID === id)
      return (
        <div className="center">
          <div className="adminBox">
            {/* DEBUG MODE */}
            {/* <p>{ Date() }</p> */}
            {/* PRODUCTION MODE */}
            <p>{getDate(text)}</p>
          </div>
        </div>
      );
    else return <></>;
  } else {
    if (user === "admin") {
      return (
        <div className="center">
          <div className="adminBox">
            <p>{text}</p>
          </div>
        </div>
      );
    }

    if (messageID === id && type !== "time") {
      return (
        <>
          <div className="messageContainer justifyEnd">
            <div className="messageBox backgroundOrange">
              <p className="messageText colorwhite">
                {ReactEmoji.emojify(text)}
              </p>
            </div>
          </div>
          <div className="messageContainer justifyEnd">
            {/* IMPLEMENT PROPERDATES */}
            {mesgType === "Dirrect Message" ? null : user}
            {/* {type === "Dirrect Message" ? Date().split(' ').slice(0,3).join(' '): null} */}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="messageContainer justifyStart">
            <img src={img} className="iconImage" />
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">
                {ReactEmoji.emojify(text)}
              </p>
            </div>
          </div>
          <div className="messageContainer justifyStart">
            {mesgType === "Dirrect Message" ? null : user}
            {/* {type === "Dirrect Message" ? Date().split(' ').slice(0,3).join(' ') : null} */}
          </div>
        </>
      );
    }
  }
};

export default Message;
