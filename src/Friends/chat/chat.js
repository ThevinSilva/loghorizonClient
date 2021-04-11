import React, { useState, useEffect, useContext } from "react";
import { profileContext } from "../../App";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import { listData } from "../../API/friendAPI";
import "./chat.css";
import ProfileContent from "../../components/ProfileContent";
import NotFound from "../../Dashboard/NotFound";

//global variable
let socket;

const Chat = () => {
  const { username, _id } = useContext(profileContext);
  const [userData, setUserData] = useState("loading");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [drawer, setDrawer] = useState(false);

  const toggleOptions = (e) => {
    e.preventDefault();
    setDrawer(!drawer);
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_SERVER, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    listData([window.location.href.slice(-21)]).then((res) => {
      if (res.data.length > 0) {
        setUserData(res.data[0]);
        //uses the url to get the id of the other party
        const otherUser = window.location.href.slice(-21);
        /**@bug 0006 */
        const roomNumber = parseInt(otherUser) + parseInt(_id);
        socket.emit("joinChat", { id: _id, name: username, room: roomNumber });

        // fetch other user's data for sidebar
      } else setUserData("notFound");
      setMessages([]);
    });

    return () => {
      socket.emit("chatDisconnect", _id);
      socket.off("joinChat");
      setUserData("loading");
    };
  }, [window.location.href]);

  useEffect(() => {
    window.onbeforeunload = () => {
      socket.emit("chatDisconnect", _id);
      socket.off("joinChat");
      setUserData("loading");
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    return () => {
      socket.off("message");
    };
  }, [messages]);

  /**
   * message that's being sent to the server to be broadcasted to the room
   * @event@fires socket#sendMessage
   * @param {Object} event
   */
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", { id: _id, message });
      setMessage("");
    }
  };

  if (userData === "notFound") {
    return <NotFound />;
  }

  return userData === "loading" ? (
    <div className="canvas-list" style={{ padding: "0", overflow: "hidden" }}>
      <div className="main-loader" />
    </div>
  ) : (
    <div className="canvas-list " style={{ padding: "0", overflow: "hidden" }}>
      <div className={drawer ? "chat-container recess" : "chat-container"}>
        <InfoBar
          value={{ room: userData.username, img: userData.img }}
          toggle={toggleOptions}
        />
        <Messages
          messages={messages}
          id={_id}
          name={username}
          img={userData.img}
        />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <div
        class={
          drawer
            ? "card drawer grey darken-4"
            : "card drawer hidden grey darken-4"
        }
      >
        <img
          src={userData.img}
          alt={`${userData.username}`}
          style={{ width: "100%", height: "auto" }}
        />
        <span class="card-title">{userData.username}</span>
        <div style={{ fontSize: "0.7rem" }}>
          <ProfileContent data={userData} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
