import React, { useState, useEffect, useContext, useReducer } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { profileContext } from "../App";
import { Tab, Tabs } from "react-materialize";
import "./Boards.css";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as GiIcons from "react-icons/gi";
import * as MdIcons from "react-icons/md";
import * as ImIcons from "react-icons/im";
import * as GoIcons from "react-icons/go";
import * as board from "../API/boardsAPI";
import * as friend from "../API/friendAPI";
import io from "socket.io-client";
import M from "materialize-css";
import Post from "./Post.js";
import * as uuid from "uuid";
import { Menu, Item, Separator, useContextMenu, theme } from "react-contexify";
import { searchData } from "../API/boardsAPI";
import "react-contexify/dist/ReactContexify.min.css";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toBase64 } from "../helper";
import NotFound from "../Dashboard/NotFound";

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

//NOTE bcrypt by design has a different hash for each plain text this information will not help anyone

export const boardContext = React.createContext();

//constant

const MENU_ID = "menu-id";

let socket;

// use old syntax to hoist
function reducer(state, action) {
  switch (action.type) {
    case "addPost":
      const { id, ...rest } = action.value;
      return { ...state, [id]: rest };
    case "addReply":
      return {
        ...state,
        [action.value.id]: {
          ...state[action.value.id],
          comments: [...state[action.value.id].comments, action.value.reply],
        },
      };

    case "editPost":
      return {
        ...state,
        [action.value.id]: {
          ...state[action.value.id],
          post: action.value.post,
          date: action.value.date,
        },
      };

    case "delPost":
      let { username, img, date, level } = state[action.value];
      return {
        ...state,
        [action.value]: { username, post: null, img, date, level },
      };
    case "upVote":
      return {
        ...state,
        [action.value.id]: {
          ...state[action.value.id],
          votes: state[action.value.id].votes + 1,
          voteList: state[action.value.id].voteList.includes(
            action.value.usernameID
          )
            ? state[action.value.id].voteList
            : [...state[action.value.id].voteList, action.value.usernameID],
        },
      };
    case "downVote":
      return {
        ...state,
        [action.value.id]: {
          ...state[action.value.id],
          votes: state[action.value.id].votes - 1,
          voteList: state[action.value.id].voteList.includes(
            action.value.usernameID
          )
            ? state[action.value.id].voteList
            : [...state[action.value.id].voteList, action.value.usernameID],
        },
      };
    case "pinned":
      return {
        ...state,
        [action.value.id]: {
          ...state[action.value.id],
          pin: !state[action.value.id].pin,
        },
      };
    case "load":
      return { ...action["value"], ...state };
    case "unload":
      return {};
    default:
      return new Error();
  }
}

const ViewBoards = () => {
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  // STYLE STATES
  const [contractRight, setContractRight] = useState(false);
  const [contractBottom, setContractBottom] = useState(false);
  const [boardPicHeight, setBoardPicHeight] = useState(6);
  const [notFound, setNotFound] = useState(false);

  // BOARD DATA STATES
  const [mainLoading, setMainLoading] = useState(true);
  const [data, setData] = useState({});
  const [level, setLevel] = useState(4);
  const [login, setLogin] = useState({});
  const [search, setSearch] = useState("");
  const [post, setPost] = useState("**Hello World!!!**");
  const [editMode, setEditMode] = useState({});
  const [editName, setEditName] = useState(false);
  const [userList, setUserList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  //searched users

  // for now initial state is empty array
  const [posts, dispatch] = useReducer(reducer, {});
  const userObj = useContext(profileContext);
  const { _id, username, img } = userObj;
  const [participents, setParticipents] = useState([]);
  const [moderators, setModerators] = useState([]);
  const [owner, setOwner] = useState({});
  const [boardName, setBoardName] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [blackList, setBlackList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("write");

  function handleItemClick({ event, props }) {
    let { id } = props;
    switch (event.currentTarget.id) {
      case "promote":
        socket.emit("promoteServer", { id, boardURI: login.boardURI });
        break;
      case "ban":
        socket.emit("banServer", { id, boardURI: login.boardURI });
        break;
      default:
        window.location.replace(`../f/chat/${id}`);
    }
  }

  //  function for handling posts
  const postMan = () => {
    const { boardURI } = login;
    const { name } = data;
    // EMITTER [postToServer] - fires posts to server
    if (level <= 2) {
      socket.emit("postToServer", {
        boardURI,
        usernameID: _id,
        username,
        name,
        post,
        level,
        img,
        id: uuid.v4(),
      });
      setPost("");
    }
  };

  function displayMenu(e) {
    // pass the item id so the `onClick` on the `Item` has access to it
    show(e, {
      props: { type: e.currentTarget.type, id: e.target.id },
    });
  }

  //  function for handling posts
  const changeBackground = (e) => {
    e.preventDefault();
    let file = URL.createObjectURL(e.target.files[0]);
    toBase64(e.target.files[0]).then((res) => {
      setData({ ...data, background: file });
      socket.emit("updateImage", {
        update: "backgroundImage",
        data: res,
        boardURI: login.boardURI,
      });
    });
  };

  const postsLoader = () => {
    board
      .load({ boardURI: login.boardURI, length: Object.keys(posts).length })
      .then((res) => {
        console.log(res);
        dispatch({ type: "load", value: res.data });
      });
  };

  const editPost = (id) => {
    socket.emit("edit", { id, post, boardURI: login.boardURI });
  };

  const changeBoardName = () => {
    socket.emit("boardNameChange", { boardURI: login.boardURI, boardName });
  };

  // BOARD DATA FETCHING & AUTHORISATION SEQUENCE
  useEffect(() => {
    //reset everything to defaults
    setMainLoading(true);
    dispatch({ type: "unload" });
    setLevel(4);
    setData({});
    setLogin({});
    setBoardName("");
    setParticipents([]);
    setModerators([]);
    setOwner({});
    board
      .loginInfo(window.location.href.split("/").pop())
      .then((loginResponse) => {
        setLogin(loginResponse.data);
        const { boardURI, password } = loginResponse.data;
        if (!password) {
          board
            .authorize({
              password,
              boardURI,
            })
            .then((res) => {
              if (res.data.level > 2) window.location.replace("../");
              setLevel(res.data.level);
              board
                .boardData(window.location.href.split("/").pop())
                .then((res) => {
                  console.log(`\n whitelist${res.data.whitelist}\n`);
                  setData(res.data);
                  setBoardName(res.data.name);
                });
            })
            .catch((err) => {
              setErrorMessage(err.response.data);
            });
        }
        setMainLoading(false);
      })
      .catch((err) => setNotFound(true));
  }, [window.location.href]);

  // Load Posts
  useEffect(() => {
    if (level <= 2 && login.boardURI) postsLoader();
  }, [level, login]);

  useEffect(() => {
    if (!mainLoading) {
      document.querySelector(".canvas-list").addEventListener(
        "scroll",
        function (event) {
          let innerContainerHeight = document.querySelector(".canvas-list")
            .scrollTop;
          if (
            0 < innerContainerHeight < 295 &&
            innerContainerHeight % 1 === 0
          ) {
            // must change css of board picture
            setBoardPicHeight(6 - (innerContainerHeight / 295) * 2);
          }
        },
        { passive: true }
      );
    }
  });

  useEffect(() => {
    // EMITTER [joinBOARD] - fires when authorization process is complete
    socket = io(process.env.REACT_APP_SERVER, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });

    if (level <= 2 && level !== 4) {
      console.log("success");
      socket.emit("joinBoard", { boardURI: login.boardURI, userObj });
    }

    return () => {
      socket.off("joinBoard");
    };
  }, [data, login, userObj]);

  // FETCHES USER LIST INFORMATION
  useEffect(() => {
    if (data.owner) {
      // do one call instead of many
      const combined = [
        data.owner,
        ...data.moderators,
        ...data.participents,
        ...data.blacklist,
      ];

      friend.listData(combined).then((res) => {
        const temp = res.data.map((x) => {
          return { ...x, order: combined.indexOf(x._id) };
        });
        // mongoose doesn't return querry in the same order this is the fix
        const sorted = temp.sort((x, y) => x.order - y.order);
        setOwner(sorted[0]);
        if (data.moderators)
          setModerators(sorted.slice(1, data.moderators.length + 1));
        if (data.participents)
          setParticipents(
            sorted.slice(
              data.moderators.length + 1,
              data.moderators.length + data.participents.length + 1
            )
          );
        if (data.blacklist)
          setBlackList(
            sorted.slice(
              data.moderators.length + data.participents.length + 1,
              data.moderators.length +
                data.participents.length +
                data.blacklist.length +
                1
            )
          );
      });
    }
  }, [data]);

  //whitelist user search
  useEffect(() => {
    searchData(search)
      .then((res) => {
        let temp = Object.keys(res.data).filter(
          (x) =>
            !Array.from(
              [...moderators, ...participents, owner],
              (x) => x._id
            ).includes(x)
        );
        setUserList(
          Array.from(temp, (x) => {
            return { _id: x, ...res.data[x] };
          })
        );
      })
      .catch((err) => console.log(err));
  }, [search]);

  // //userJoin
  useEffect(() => {
    socket.on("userJoined", (userObj) => {
      console.log(moderators);
      console.log(data.owner);
      if (
        userObj._id !== owner._id &&
        !moderators.findIndex((x) => userObj._id === x._id)
      ) {
        setParticipents((current) => {
          if (!current.findIndex((x) => x._id === userObj._id))
            return [...current, userObj];
          else return current;
        });
      }
    });
    return () => socket.off("userJoined");
  }, [moderators]);

  // POST
  useEffect(() => {
    socket.on("postToClient", (post) => {
      console.log("anythin");
      console.log(post);
      // make post a reducet to prevent insanely high complexities
      dispatch({ type: "addPost", value: post });
    });

    return () => socket.off("postToClient");
  }, [data]);
  // DELETE POST
  useEffect(() => {
    socket.on("deletePostClient", (id) => {
      console.log("delete post");
      dispatch({ type: "delPost", value: id });
    });
    return () => socket.off("deletePostClient");
  }, [data]);

  // UPVOTE POST
  useEffect(() => {
    socket.on("upVoteClient", ({ id, usernameID }) => {
      console.log(id, usernameID);
      console.log("upvote post");
      dispatch({ type: "upVote", value: { id, usernameID } });
    });
    return () => socket.off("upVoteClient");
  }, [data]);

  // DOWNVOTE POST
  useEffect(() => {
    socket.on("downVoteClient", (id) => {
      console.log("downvote post");
      dispatch({ type: "downVote", value: id });
    });
    return () => socket.off("downVoteClient");
  }, [data]);

  // PIN POST
  useEffect(() => {
    socket.on("pinClient", (id) => {
      dispatch({ type: "pinned", value: { id } });
    });
    return () => socket.off("pinClient");
  }, [data]);

  // COMMENT / REPLY TO POST
  useEffect(() => {
    socket.on("replyClient", ({ id, ...replyObj }) => {
      console.log("no hitch");
      dispatch({ type: "addReply", value: { id, reply: replyObj } });
    });
    return () => socket.off("replyClient");
  }, [data]);

  // EDIT POST
  useEffect(() => {
    socket.on("editClient", ({ id, post, date }) => {
      console.log("no hitch 2");
      dispatch({ type: "editPost", value: { id, post, date } });
    });
    return () => socket.off("editClient");
  }, [editMode]);

  // banning
  useEffect(() => {
    console.log(participents);
    socket.on("banClient", (id, username) => {
      setParticipents((current) => current.filter((x) => x._id !== id));
      setModerators((current) => current.filter((x) => x._id !== id));
      if (id === _id) window.location.replace("../");
    });
    return () => socket.off("banClient");
  }, [data]);

  //promoting
  useEffect(() => {
    socket.on("promoteClient", (id) => {
      setModerators((current) => [
        ...current,
        participents.find((x) => x._id === id),
      ]);
      setParticipents((current) => current.filter((x) => x._id !== id));
    });
  }, [participents]);

  if (notFound) {
    return <NotFound />;
  }

  return mainLoading ? (
    <div className="canvas-list">
      <div className="main-loader"></div>
    </div>
  ) : login.password ? (
    <div className="canvas-list">
      <div className="passwordBox ">
        <div className="center-align">
          <img
            src={login.image}
            style={{ marginTop: "10%", height: "6rem", width: "6rem" }}
          />
          <br />
          <span className="passwordBoardName">b/{login.boardURI}</span>
        </div>
        <form
          className="row"
          style={{ padding: "5%" }}
          onSubmit={(e) => {
            e.preventDefault();
            board
              .authorize({
                boardURI: window.location.href.split("/").pop(),
                password: document.querySelector("#password").value,
              })
              .then((res) => {
                console.log(res.data.result);
                if (res.data.result) {
                  board
                    .boardData(window.location.href.split("/").pop())
                    .then((res) => {
                      setData(res.data);
                      setBoardName(res.data.name);
                      setLogin({ ...login, password: false });
                    })
                    .catch((err) => console.log(err));
                }
                setLevel(res.data.level);
                console.log(level);
              })
              .catch((err) => {
                let errorCode = err.message.split(" ").pop();

                switch (parseInt(errorCode)) {
                  case 403:
                    M.toast({
                      html:
                        '<span style="color:#ff8a80;">ALERT: Invalid Password</span>',
                    });
                    break;
                  case 402:
                    M.toast({
                      html:
                        '<span style="color:#ff8a80;">ALERT: You are not whitelisted</span>',
                    });
                    break;
                  case 401:
                    M.toast({
                      html:
                        '<span style="color:#ff8a80;">ALERT: You are Banned</span>',
                    });
                    break;
                  default:
                    console.log(err.message);
                    break;
                }
              });
          }}
        >
          <div className=" col s10 offset-s1 input-field">
            <label for="password">password</label>
            <input id="password" type="password" name="password" />
            <input
              className="btn amber darken-3 offset-s4 col s3"
              type="submit"
              name="password"
              value="join"
            />
          </div>
        </form>
      </div>
    </div>
  ) : (
    <boardContext.Provider
      value={{
        socket,
        boardURI: login.boardURI,
        post,
        setEditMode,
        setPost,
        editMode,
      }}
    >
      <div className="canvas-list parallaxContainer scale-up-center">
        <div
          className="banner"
          style={{
            backgroundImage: `url(${data.background})`,
          }}
        >
          {_id !== data.owner || (
            <div id="changeBackground">
              <label for="image">
                <FaIcons.FaPencilAlt
                  style={{
                    position: "relative",
                    left: "1rem",
                    top: "0.8rem",
                    fontSize: "1rem",
                    color: "white",
                  }}
                />
              </label>
              <input
                type="file"
                id="image"
                style={{ opacity: "0" }}
                onChange={(e) => changeBackground(e)}
              />
            </div>
          )}
        </div>
        <div>
          <div className="infoBar ">
            <img
              id="boardPic"
              style={{
                height: `${boardPicHeight}rem`,
                width: `${boardPicHeight}rem`,
                marginTop: `-${1.7 * ((boardPicHeight - 4) / 6)}rem`,
                border: ` ${0.5 * ((boardPicHeight - 4) / 6)}rem dashed white`,
                borderRadius: "50%",
                zIndex: "3",
              }}
              src={login.image}
              alt="board"
            />
            <div className="leftInnerContainer">
              {editName ? (
                <div
                  className="input-field row"
                  style={{ margin: "0", width: "100%" }}
                >
                  <input
                    className="col s7"
                    type="text"
                    onChange={(e) => setBoardName(e.target.value)}
                    value={boardName}
                  />
                  <button
                    style={{ marginTop: "2%" }}
                    className="col s2 btn btn-flat green accent-3 text-white waves-effect"
                    onClick={() => {
                      changeBoardName();
                      setEditName(false);
                    }}
                  >
                    save
                  </button>
                  <button
                    style={{ marginTop: "2%" }}
                    className="col s2 btn btn-flat red accent-3 text-white waves-effect"
                    onClick={() => {
                      setEditName(false);
                    }}
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>{boardName}</span>
                  {!(level <= 0) || (
                    <FaIcons.FaPencilAlt
                      className={`postIcons`}
                      onClick={() => {
                        setEditName(true);
                      }}
                      style={{ fontSize: "1.4rem", marginLeft: "1%" }}
                    />
                  )}
                </>
              )}
            </div>
            <div className="rightInnerContainer">
              <AiIcons.AiOutlineMenuFold
                style={{ fontSize: "2rem", marginTop: "1rem" }}
                onClick={() => setContractRight(!contractRight)}
              />
            </div>
          </div>
          <ScrollToBottom
            mode="bottom"
            initialScrollBehavior="smooth"
            className={`postContainer ${
              contractRight ? "contract-right" : "expand-right"
            } ${!contractBottom || "contract-bottom"} z-depth-0 `}
          >
            {/*-------------------------------------------------------- post --------------------------------------------------------*/}

            <div className="row">
              <div className="center-align">
                {!(level <= 2 && Object.keys(posts).length > 4) || (
                  <button
                    className="btn amber darken-3 waves-effect "
                    style={{ margin: "0 auto", marginTop: "1% " }}
                    onClick={() => {
                      postsLoader();
                    }}
                  >
                    load more
                  </button>
                )}
                {level <= 2 || <h2>{errorMessage.toUpperCase()}</h2>}
              </div>
            </div>
            {Object.keys(posts).map((x) => (
              <Post id={x} content={posts[x]} userLevel={level} />
            ))}
          </ScrollToBottom>
          {/* MESSAGE BOX */}
          <div
            className={`messageSection grey darken-4 ${
              contractBottom ? "scale-up-center " : "scale-down-center "
            }  ${contractRight ? "contract-right" : "expand-right"} `}
          >
            {!contractBottom ? (
              <div
                className="center"
                onClick={() => {
                  setContractBottom(!contractBottom);
                }}
              >
                <IoIcons.IoMdArrowDropup style={{ fontSize: "2.3rem" }} />
              </div>
            ) : (
              <>
                <div>
                  <div
                    className="center"
                    onClick={() => {
                      setContractBottom(!contractBottom);
                    }}
                  >
                    <IoIcons.IoMdArrowDropdown style={{ fontSize: "1rem" }} />
                  </div>
                </div>
              </>
            )}
          </div>
          {/* seperate container around the editor it self to allow for fullscreen support */}
          <div
            style={contractBottom ? {} : { display: "none" }}
            className={`reactMdEditor grey darken-4 ${
              contractRight ? "contract-right" : "expand-right"
            } `}
          >
            <ReactMde
              value={post}
              onChange={setPost}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(
                  <ReactMarkdown renderers={renderers} children={post} />
                )
              }
              childProps={{
                writeButton: {
                  tabIndex: -1,
                },
              }}
            />
            {editMode.id ? (
              <div
                className="row"
                style={{ margin: "0", padding: "0", height: "3vh" }}
              >
                <div className="col s6" style={{ padding: "0" }}>
                  <button
                    className="btn waves-effect  waves-light red accent-2 "
                    style={{
                      margin: "0",
                      padding: "0",
                      height: "3vh",
                      width: " 100%",
                    }}
                    onClick={() => {
                      setEditMode({});
                      setPost("");
                    }}
                  >
                    cancel
                  </button>
                </div>
                <div className="col s6" style={{ padding: "0" }}>
                  <button
                    className="btn waves-effect waves-light  green accent-2 "
                    style={{
                      margin: "0",
                      padding: "0",
                      height: "3vh",
                      width: " 100%",
                    }}
                    onClick={() => {
                      editPost(editMode.id);
                      setEditMode({});
                    }}
                  >
                    save
                  </button>
                </div>
              </div>
            ) : (
              <button
                className=" waves-effect center waves-light postButton"
                onClick={() => {
                  postMan();
                }}
              >
                post
              </button>
            )}
          </div>
        </div>
        <div
          className={
            contractRight
              ? "rightBar rightBar-open"
              : "rightBar  rightBar-close"
          }
        >
          <div>
            <Tabs className="boardSideBar grey darken-4">
              <Tab title={<IoIcons.IoMdPeople />}>
                <br />
                <div style={{ overflowY: "hidden" }}>
                  {JSON.stringify(owner) === "{}" || (
                    <>
                      <span>
                        <FaIcons.FaCrown style={{ fontSize: "1.1rem" }} /> OWNER
                      </span>

                      <ul className="collection" style={{ border: "none" }}>
                        <li
                          className="collection-item  grey darken-3 "
                          style={{ fontSize: "0.9rem" }}
                        >
                          <section>
                            <img
                              src={owner.img}
                              alt={owner.img}
                              style={{
                                display: "inline",
                                height: "2.5rem",
                                width: "auto",
                              }}
                            />
                            <p style={{ color: "#FFFFFF" }}>{owner.username}</p>
                          </section>
                        </li>
                      </ul>
                    </>
                  )}
                  {moderators.length === 0 || (
                    <span>
                      <RiIcons.RiSwordLine style={{ fontSize: "1.1rem" }} />
                      MODERATORS
                    </span>
                  )}

                  <ul className="collection" style={{ border: "none" }}>
                    {moderators.map((x) => (
                      <li
                        className="collection-item  grey darken-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <section>
                          <img
                            src={x.img}
                            alt={x.img}
                            style={{
                              display: "inline",
                              height: "2.5rem",
                              width: "auto",
                            }}
                          />
                          <p style={{ color: "#FFFFFF" }}>{x.username}</p>
                        </section>
                        {x._id !== userObj._id || (
                          <GoIcons.GoKebabVertical
                            className="postIcons"
                            style={{
                              order: "2",
                              margin: "auto 0",
                              fontSize: "1.5rem",
                            }}
                            type={"moderator"}
                            id={x._id}
                            name={x.username}
                            onClick={displayMenu}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  {participents.length === 0 || (
                    <span>
                      <IoIcons.IoMdPerson style={{ fontSize: "1.1rem" }} />
                      PARTICIPENTS
                    </span>
                  )}
                  <ul className="collection" style={{ border: "none" }}>
                    {participents.map((x) => (
                      <li
                        className="collection-item  grey darken-3"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <section>
                          <img
                            src={x.img}
                            alt={x.img}
                            style={{
                              display: "inline",
                              height: "2.5rem",
                              width: "auto",
                            }}
                          />
                          <p style={{ color: "#FFFFFF" }}>{x.username}</p>
                        </section>
                        {x._id === userObj._id || (
                          <GoIcons.GoKebabVertical
                            className="postIcons"
                            style={{
                              order: "2",
                              margin: "auto 0",
                              fontSize: "1.5rem",
                            }}
                            type={"participents"}
                            id={x._id}
                            name={x.username}
                            onClick={displayMenu}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                  <Menu id={MENU_ID} theme={theme.dark} animation={null}>
                    <Item
                      id="ban"
                      disabled={level !== 0}
                      onClick={handleItemClick}
                    >
                      <GiIcons.GiBangingGavel style={{ fontSize: "1.1rem" }} />
                      <span style={{ marginLeft: "5%" }}>ban</span>
                    </Item>
                    <Separator />
                    <Item
                      id="promote"
                      disabled={({ type, props }) =>
                        level !== 0 || "moderator" === props.type
                      }
                      onClick={handleItemClick}
                    >
                      <RiIcons.RiSwordLine style={{ fontSize: "1.1rem" }} />
                      <span style={{ marginLeft: "5%" }}>promote</span>
                    </Item>
                    <Separator />
                    <Item id="message" onClick={handleItemClick}>
                      <BiIcons.BiMessageRoundedDots
                        style={{ fontSize: "1.1rem" }}
                      />
                      <span style={{ marginLeft: "5%" }}>message</span>
                    </Item>
                  </Menu>
                </div>
              </Tab>
              <Tab title={<AiIcons.AiFillInfoCircle />}>
                <article>
                  <img style={{ width: "100%" }} src={login.image} />
                  <h4>{boardName}</h4>
                  <p>{data.description}</p>
                </article>
              </Tab>

              <Tab title={<GiIcons.GiScales />} disabled={level !== 0}>
                <article>
                  <h4 className="center-align">Appeal</h4>
                  <p className="center-align">remove users from blacklist</p>
                  <div className="collection" style={{ border: "none" }}>
                    {blackList.map((x) => (
                      <div
                        className="collection-item black-text"
                        style={{
                          border: "none",
                          padding: "1%",
                          marginBottom: "5%",
                        }}
                      >
                        <section>
                          <img
                            style={{
                              marginLeft: "2%",
                              width: "30%",
                              height: "auto",
                            }}
                            src={x.img}
                            alt={`${x._id}'s profile `}
                          />
                          <p style={{ fontSize: "0.6rem" }}>{x.username}</p>
                        </section>

                        <ImIcons.ImCross
                          className="postIcons"
                          style={{
                            fontSize: "0.7rem",
                            margin: "auto 0.5rem",
                            order: "2",
                          }}
                          onClick={() => {
                            setBlackList((current) => {
                              return current.filter((y) => y._id !== x._id);
                            });
                            socket.emit("addToServer", {
                              id: x._id,
                              boardURI: login.boardURI,
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </article>
              </Tab>
              <Tab
                title={<FaIcons.FaClipboardCheck />}
                disabled={!data.whitelist || level !== 0}
              >
                <article>
                  <h4 className="center-align">Whitelist</h4>
                  <p className="center-align">
                    add users to whitelist or blacklist
                  </p>
                  <div
                    className="input-field"
                    style={{ width: "80%", margin: "0 auto" }}
                  >
                    <input
                      type="text"
                      placeholder="username"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="collection" style={{ border: "none" }}>
                    {userList.map((x) => (
                      <div
                        className="collection-item black-text"
                        style={{
                          border: "none",
                          padding: "1%",
                          marginBottom: "5%",
                        }}
                      >
                        <section>
                          <img
                            style={{
                              marginLeft: "2%",
                              width: "30%",
                              height: "auto",
                            }}
                            src={x.img}
                            alt={`${x._id}'s profile `}
                          />
                          <p style={{ fontSize: "0.6rem" }}>{x.username}</p>
                        </section>
                        <div className="btn-container">
                          <div
                            className="btn waves-effect waves-light green"
                            key={x._id}
                            onClick={() => {
                              setUserList((curret) =>
                                curret.filter((y) => y._id !== x._id)
                              );
                              socket.emit("addToServer", {
                                boardURI: login.boardURI,
                                id: x._id,
                              });
                            }}
                            style={{
                              width: "2.5rem",
                              height: "2.5rem",
                              marginLeft: "2rem",
                            }}
                          >
                            <MdIcons.MdAddCircle
                              style={{ margin: "auto", fontSize: "1rem" }}
                            />
                          </div>
                          <div
                            className="btn waves-effect waves-light red"
                            onClick={() => {
                              setUserList((curret) =>
                                curret.filter((y) => y._id !== x._id)
                              );
                              socket.emit("banServer", {
                                boardURI: login.boardURI,
                                id: x._id,
                              });
                              setBlackList((current) => [
                                ...current,
                                userList.find((y) => y._id === x._id),
                              ]);
                            }}
                            style={{ width: "2.5rem", height: "2.5rem" }}
                          >
                            <FaIcons.FaBan
                              style={{ margin: "auto", fontSize: "0.7rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </boardContext.Provider>
  );
};

export default ViewBoards;
