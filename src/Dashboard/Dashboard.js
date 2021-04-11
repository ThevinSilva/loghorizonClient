import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.css";
import io, { Socket } from "socket.io-client";
import { profileContext } from "../App";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "react-materialize";
import * as board from "../API/boardsAPI";
import * as friend from "../API/friendAPI";
import axios from "axios";
import BoardList from "../components/BoardList";
import { getDate } from "../helper";
let socket;

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [boards, setBoards] = useState([]);
  const [friends, setFriends] = useState([]);
  const [devlog, setDevlog] = useState([]);
  /**@bug 0004 */
  const [trending, setTrending] = useState([]);
  const { _id, boardList, friendsList } = useContext(profileContext);
  useEffect(() => {
    socket = io(process.env.REACT_APP_SERVER, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    socket.emit("dashboard", _id);

    //fetch list of Boards
    board.listData(boardList).then((res) => {
      setBoards(res.data);
      console.log(res.data);
    });

    //fetch list of Friends
    friend.listData(friendsList).then((res) => {
      setFriends(res.data);
    });
    // fetch Trending list
    board.trending().then((res) => setTrending(res.data));

    //fetch list of DevLog
    axios({
      method: "get",
      url: process.env.REACT_APP_SERVER + "/dev/dashboard",
      withCredentials: true,
    }).then((res) => setDevlog(res.data));
  }, []);

  useEffect(() => {
    socket.on("dashboardClient", (obj) => {
      console.log("yes");
      if (posts.length === 3) {
        let temp = posts;
        temp.shift();
        setPosts(temp);
      }
      setPosts([...posts, obj]);
    });
  });

  return (
    <div className="canvas row fade-in">
      <div className="col s3 push-s9">
        {/* TRENDING */}
        <div
          className="collection white black-text"
          style={{
            margin: "0vh",
            overflowY: "auto",
            overflowX: "hidden",
            height: "40vh",
          }}
        >
          <span className="title">TRENDING</span>
          {trending.map((x) => (
            <Link
              className="collection-item black-text"
              key={x.boardURI}
              to={`/app/b/${x.boardURI}`}
            >
              <div style={{ marginLeft: "5%", width: "20%" }}>
                <span style={{ marginBottom: "0" }}>{x.participentLength}</span>
              </div>
              <img src={x.image} style={{ height: "3rem" }} />
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "0",
                    display: "block",
                  }}
                >
                  {x.name}
                </span>
                <span style={{ fontSize: "0.8rem", marginTop: "0" }}>
                  b/{x.boardURI}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {/* patch notes / devlog */}
        <div
          className="collection white text-black"
          style={{
            marginTop: "3vh",
            overflowY: "auto",
            overflowX: "hidden",
            height: "39vh",
          }}
        >
          <span className="title">DEVLOG</span>
          <div className="collection">
            {devlog.map((x) => (
              <article className="collection-item black-text ">
                <div>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      marginTop: "0",
                      display: "block",
                    }}
                  >
                    <b>{x.title}</b>
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      marginTop: "0",
                      marginLeft: "1rem",
                    }}
                  >
                    psoted by <b>{x.byLine}</b> at <i>{getDate(x.date)}</i>
                  </span>

                  <p
                    className="container"
                    style={{ marginLeft: "10%", fontSize: "0.6rem" }}
                  >
                    {x.post.substring(0, 50)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="col s9 pull-s3">
        <div className="white black-text">
          <span
            className="title"
            style={{ paddingTop: "2%", fontSize: "2rem", margin: "latest" }}
          >
            POSTS
          </span>
          <div className="posts-jumbotron">
            {posts.length !== 0 ? (
              posts.map((x, i) => (
                <Link
                  to={`/app/b/${x.boardURI}`}
                  id={`items-${i}`}
                  className={`posts-jumbotron-item white-text grey darken-4 ${
                    posts.length >= 3 && i <= 1 ? "" : "fade-in-fwd"
                  } 
                `}
                >
                  {/* header */}
                  <section className="posts-jumbotron-item-header ">
                    <img src={x.img} style={{ height: "3rem" }} />
                    <div style={{ marginLeft: "5%" }}>
                      <span style={{ display: "block", marginBottom: "0" }}>
                        {x.name}
                      </span>
                      <span style={{ fontSize: "0.8rem", marginTop: "0" }}>
                        b/{x.boardURI}
                      </span>
                    </div>
                    <span style={{ position: "absolute", right: "0" }}>
                      {x.date}
                    </span>
                  </section>
                  {/* post */}
                  <p
                    className="container"
                    style={{ fontSize: "0.8rem", marginTop: "4%" }}
                  >
                    {x.post.length > 200
                      ? `${x.post.substring(0, 200)}...`
                      : x.post}
                  </p>
                </Link>
              ))
            ) : (
              <div className="container center-align">
                <object
                  data={
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    "/app/Empty_Inbox _Two_Color.svg"
                  }
                  style={{
                    display: "block",
                    margin: "0 auto",
                    height: "70%",
                    width: "70%",
                  }}
                >
                  post box{" "}
                </object>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: "3%" }}>
          <Tabs tabOptions={{ swipeable: true }}>
            <Tab title="BOARDS">
              <div
                className="collection white"
                style={{
                  height: "40vh",
                  margin: "0vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <BoardList boards={boards} />
              </div>
            </Tab>
            <Tab title="PEOPLE">
              <div
                className="collection white"
                style={{
                  height: "40vh",
                  margin: "0vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {friends.map((x) => (
                  <Link
                    to={`./app/f/chat/${x._id}`}
                    className="collection-item"
                  >
                    <section>
                      <img src={x.img} alt={`${x.username}`} />
                      <p>{x.username}</p>
                    </section>
                  </Link>
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>

      {/*Lates patch note */}

      {/*Boards & Friends */}

      {/**/}
    </div>
  );
};

export default Dashboard;
