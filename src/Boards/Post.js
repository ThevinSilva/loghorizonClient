import React, { useContext, useState, useEffect } from "react";
import * as IoIcons from "react-icons/io";
import * as BiIcons from "react-icons/bi";
import * as ImIcons from "react-icons/im";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import * as RiIcons from "react-icons/ri";
import { profileContext } from "../App";
import { boardContext } from "./viewBoards";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderers = {
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter
        style={materialDark}
        language={language}
        children={value}
      />
    );
  },
  image: ({ alt, src, title }) => (
    <img alt={alt} src={src} title={title} style={{ maxWidth: 475 }} />
  ),
};

const Post = ({ content, id, userLevel }) => {
  const { _id, img: userImage, username } = useContext(profileContext);
  const {
    socket,
    boardURI,
    setEditMode,
    editMode,
    post: postEditor,
    setPost,
  } = useContext(boardContext);
  const [viewMore, setViewMore] = useState(false);
  const [reply, setReply] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [edited, setEdited] = useState(content.edited);
  // name is unnecessary

  // Needs
  // - comments
  // - date
  // - votes

  const {
    name,
    username: posterName,
    post,
    level,
    img,
    date,
    comments,
    votes,
    usernameID,
    voteList,
    pin,
  } = content;

  useEffect(() => {
    if (editMode.id === id && edited !== true) {
      console.log("alright time to shine");
      setEdited(true);
    }
  }, [editMode]);

  const postHandler = {
    deletePost: () => {
      socket.emit("deletePost", { boardURI, id });
    },
    editPost: () => {
      socket.emit("editPost", { boardURI, id });
    },
    pinPost: () => {
      socket.emit("pin", { boardURI, id, pin: !pin });
    },
    upVote: () => {
      socket.emit("upVote", { boardURI, id, usernameID: _id });
    },
    downVote: () => {
      socket.emit("downVote", { boardURI, id, usernameID: _id });
    },
    reply: () => {
      socket.emit("reply", {
        boardURI,
        id,
        reply: replyValue,
        usernameID,
        userImage,
        username,
      });
      setReplyValue("");
      setReply(!reply);
    },
  };
  return post === null ? (
    <div className="post row">
      <div className="body col s11 push-s1">
        <div className="postbar">
          {/* <div className="leftInnerContainer"> */}
          <span>
            {level === 0 ? (
              <FaIcons.FaCrown style={{ fontSize: "1rem" }} />
            ) : level === 1 ? (
              <RiIcons.RiSwordLine style={{ fontSize: "1rem" }} />
            ) : (
              <></>
            )}
            &#160; {posterName} |
            <span style={{ fontSize: "0.75rem" }}> {date}</span>
          </span>
           
        </div>
        <article className="center" style={{ height: "10vh" }}>
          POST HAS BEEN DELETE
        </article>

        {/* leftBard */}
      </div>
      <section className="col s1 pull-s11">
        <img
          src={img}
          alt={"profile picture of " + posterName}
          style={{
            height: "4rem",
            margin: "0 auto",
            marginTop: "10%",
          }}
        />
      </section>
    </div>
  ) : (
    <div
      className={`post row ${!(editMode.id === id) || "post-popup z-depth-5"}`}
      style={pin ? { color: "#212121", background: "white" } : {}}
    >
      <div className="body col s11 push-s1">
        <div className="postbar">
          {/* <div className="leftInnerContainer"> */}
          <span style={{ margin: "0", marginTop: "1%" }}>
            {level === 0 ? (
              <FaIcons.FaCrown style={{ fontSize: "1rem" }} />
            ) : level === 1 ? (
              <RiIcons.RiSwordLine style={{ fontSize: "1rem" }} />
            ) : (
              <></>
            )}
            &#160; {posterName} |&#160;
            {!edited || <span style={{ fontSize: "0.75rem" }}>edited at </span>}
            <span style={{ fontSize: "0.75rem" }}>{date}</span>
          </span>
           
          <div className="rightInnerContainer">
            {!(userLevel === 0 || _id === usernameID) || (
              <AiIcons.AiFillDelete
                className="postIcons"
                style={{ fontSize: "1.4rem", marginLeft: "5%" }}
                onClick={(e) => {
                  e.preventDefault();
                  postHandler.deletePost();
                }}
              />
            )}
            {userLevel === 2 || (
              <AiIcons.AiFillPushpin
                onClick={(e) => {
                  e.preventDefault();
                  postHandler.pinPost();
                }}
                className={"postIcons"}
                style={{ fontSize: "1.4rem", marginLeft: "5%" }}
              />
            )}

            {_id !== usernameID || (
              <FaIcons.FaPencilAlt
                className={`postIcons ${
                  !(editMode.id === id) || "postIcons-active"
                }`}
                onClick={() => {
                  if (!editMode.id) {
                    setEditMode({ id });
                    setPost(post);
                  }
                }}
                style={{ fontSize: "1.4rem", marginLeft: "5%" }}
              />
            )}
            <FaIcons.FaReply
              onClick={() => {
                setReply(!reply);
              }}
              className={`postIcons ${!reply || "postIcons-active"}`}
              style={{ fontSize: "1.4rem", marginLeft: "5%" }}
            />
          </div>
        </div>
        <article style={{ margin: "1% 0", marginLeft: "1%" }}>
          <ReactMarkdown
            renderers={renderers}
            children={!(editMode.id === id) ? post : postEditor}
          />
        </article>
        {!(content.comments.length > 0) || (
          <div className="row">
            <div
              className="col s3 postIcons"
              style={{ transform: "scale(1)" }}
              onClick={() => {
                setViewMore(!viewMore);
              }}
            >
              <IoIcons.IoMdArrowDropdown /> view more
            </div>
            {!(viewMore && comments.length > 0) || (
              <div
                className="collection"
                style={{
                  width: "95%",
                  margin: "0 auto",
                  border: "none",
                }}
              >
                {comments.map((x) => (
                  <div className=" row comment">
                    <div className="col s1 center">
                      <img
                        src={x.userImage}
                        alt={x.img}
                        style={{
                          height: "4rem",
                        }}
                      />
                    </div>
                    <div className="col s9 ">
                      <span>posted by {x.username} </span>
                      <p>{x.reply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!reply || (
          <div className="row">
            <div className=" col s1" style={{ marginLeft: "2%" }}>
              <img
                src={userImage}
                style={{ height: "4rem", margin: "0 auto" }}
              />
            </div>
            <div className="input-field  col s9">
              <input
                style={{ color: "white" }}
                type="text"
                name="reply"
                onChange={(e) => {
                  setReplyValue(e.target.value);
                }}
                value={replyValue}
              />
              <label for="reply">reply</label>
            </div>
            <div className="col s1">
              <button
                className="btn waves-effect waves-light amber darken-2 text-white"
                onClick={() => {
                  postHandler.reply();
                }}
              >
                send
              </button>
            </div>
          </div>
        )}

        {/* comments */}
      </div>
      <section className="col s1 pull-s11">
        <img
          src={img}
          alt={"profile picture of " + username}
          style={{
            height: "4rem",
            margin: "0 auto",
            marginTop: "15%",
          }}
        />
        {voteList.includes(_id) ? (
          <BiIcons.BiPlusMedical
            className="postIcons-inactive"
            style={{
              fontSize: "1.4rem",
              margin: "0 auto",
              marginTop: "15%",
            }}
          />
        ) : (
          <BiIcons.BiPlusMedical
            className="postIcons"
            onClick={(e) => {
              e.preventDefault();
              postHandler.upVote();
            }}
            style={{
              fontSize: "1.4rem",
              margin: "0 auto",
              marginTop: "15%",
            }}
          />
        )}
        <span
          className={`${!voteList.includes(_id) || "postIcons-inactive"}`}
          style={{
            fontSize: "1.4rem",
            margin: "0 auto",
            marginTop: "10%",
          }}
        >
          {votes}
        </span>
        {voteList.includes(_id) ? (
          <ImIcons.ImMinus
            className="postIcons-inactive"
            style={{
              fontSize: "1.4rem",
              margin: "10% auto",
            }}
          />
        ) : (
          <ImIcons.ImMinus
            className="postIcons"
            onClick={(e) => {
              e.preventDefault();
              postHandler.downVote();
            }}
            style={{
              fontSize: "1.4rem",
              margin: "10% auto",
            }}
          />
        )}
      </section>
    </div>
  );
};

export default Post;
