import React, { useContext, useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import { profileContext } from "../App";
import { Tabs, Tab } from "react-materialize";
import "./friends.css";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa";
import * as TiIcons from "react-icons/ti";
import * as ImIcons from "react-icons/im";
import {
  pendingData,
  sentData,
  listData,
  requestData,
  checkData,
  searchData,
} from "../API/friendAPI";

// Pending Reducer

const pendingReducer = (state, action) => {
  switch (action.type) {
    case "accept":
      checkData({ from: action.id, status: "accepted" })
        .then(() => console.log("yep"))
        .catch((err) => console.log(err));
      return state.filter((x) => x._id !== action.id);
    case "reject":
      checkData({ from: action.id, status: "rejected" })
        .then(() => {
          console.log("accepted");
        })
        .catch((err) => console.log(err));
      return state.filter((x) => x._id !== action.id);
    case "load":
      return action.payload;
    default:
      throw new Error();
  }
};

const Friends = () => {
  // search items
  const [search, setSearch] = useState("");
  //TAB 2 all friend's list
  const [friendsList, setFriendsList] = useState("loading");
  // pending list of friends
  const [pendingList, pendingDispatch] = useReducer(pendingReducer, "loading");
  // List of items returned by the search
  const [items, setItems] = useState([]);
  // List of sent requests
  const [sent, setSent] = useState([]);

  const profileData = useContext(profileContext);

  // Re-render triggers when ever page is loaded
  useEffect(() => {
    listData(profileData.friendsList).then((res) => setFriendsList(res.data));

    const pendingFetcher = async () => {
      const tempData = await pendingData();
      // e --> docs IDRequested that awaits your aproval
      const friendsData = await listData(
        Array.from(tempData.data, (e) => e.IDRequested)
      );
      pendingDispatch({ type: "load", payload: friendsData.data });
    };
    pendingFetcher();

    const sentFetcher = async () => {
      const tempData = await sentData();
      // e --> docs IDRecipient that awaits there aproval
      const friendsData = await listData(
        Array.from(tempData.data, (e) => e.IDRecipient)
      );
      setSent(friendsData.data);
    };
    sentFetcher();
  }, []);

  const findFriend = async (evt) => {
    evt.preventDefault();
    const tempVal = await searchData({
      query: search,
      list: profileData.friendsList,
    });
    setItems(tempVal.data);
  };

  const handleRequest = (id) => {
    setItems([]);
    requestData(id).then(() => {});
  };

  return (
    <div className="canvas-list fade-in">
      <div className="row">
        <div className="col s12">
          <Tabs className=" z-index-1">
            <Tab title="All">
              <div
                className="collection attached white black-text"
                style={{
                  height: "75vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div className="title">
                  <span style={{ margin: "2% 0", padding: "0" }}>ALL</span>
                </div>
                {friendsList === "loading" ? (
                  <div className="main-loader" style={{ top: "10vh" }} />
                ) : friendsList.length > 0 ? (
                  <div
                    className="center-align collection"
                    style={{
                      overflowY: "auto",
                      height: "55vh",
                      width: "100%",
                      border: "none",
                    }}
                  >
                    {friendsList.map((x) => (
                      <Link
                        to={`./f/chat/${x._id}`}
                        className="collection-item z-index-0"
                      >
                        <section>
                          <img src={x.img} alt={`${x.username}`} />
                          <p>{x.username}</p>
                        </section>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div
                    className="center-align amber-text text-darken-4"
                    style={{
                      padding: "2rem",
                      display: "relative",
                      top: "10vh",
                    }}
                  >
                    <object
                      data="./Sun_Monochromatic.svg"
                      style={{ display: "block", margin: "0 auto" }}
                    >
                      desert image
                    </object>
                    <h6>tumbleweed rolls past</h6>
                  </div>
                )}
              </div>
            </Tab>
            <Tab title="sent">
              <div
                className="collection attached white black-text"
                style={{
                  height: "75vh",
                  overflowY: "hidden",
                  overflowX: "hidden",
                }}
              >
                <div className="title">
                  <span style={{ margin: "2% 0", padding: "0" }}>SENT</span>
                </div>
                {sent === "loading" ? (
                  <div className="main-loader" />
                ) : sent.length > 0 ? (
                  <div
                    className="center-align collection"
                    style={{
                      overflowY: "auto",
                      height: "55vh",
                      width: "100%",
                      border: "none",
                    }}
                  >
                    {sent.map((x) => (
                      <a href="#!" className="collection-item">
                        <section>
                          <img src={x.img} alt={`${x.username}`} />
                          <p>{x.username}</p>
                        </section>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div
                    className="center-align amber-text text-darken-4"
                    style={{
                      padding: "2rem",
                      display: "relative",
                      top: "10vh",
                    }}
                  >
                    <object
                      data="./Empty Inbox _Monochromatic.svg"
                      style={{ display: "block", margin: "0 auto" }}
                    >
                      desert image
                    </object>
                    <h6>oof that's rough buddy</h6>
                  </div>
                )}
              </div>
            </Tab>
            <Tab title="PENDING">
              <div
                className="collection attached white black-text"
                style={{
                  height: "75vh",
                  overflowY: "hidden",
                  overflowX: "hidden",
                }}
              >
                <div className="title">
                  {/* <IoIcons.IoMdPersonAdd
                    style={{
                      margin: "2% 0",
                      marginRight: "1%",
                      fontSize: "5.1rem",
                    }}
                  /> */}
                  <span style={{ margin: "2% 0", padding: "0" }}>PENDING</span>
                </div>
                {pendingList === "loading" ? (
                  <div className="main-loader" />
                ) : pendingList.length > 0 ? (
                  <div
                    className="center-align collection"
                    style={{
                      overflowY: "auto",
                      height: "55vh",
                      width: "100%",
                      border: "none",
                    }}
                  >
                    {pendingList.map((x) => (
                      <div href="#!" className="collection-item">
                        <section>
                          <img src={x.img} alt={`${x.username}`} />
                          <p>{x.username}</p>
                        </section>
                        <div className="btn-container">
                          <div
                            className="btn waves-effect waves-light green"
                            style={{ marginLeft: "2rem" }}
                            key={x._id}
                            onClick={() =>
                              pendingDispatch({ type: "accept", id: x._id })
                            }
                            style={{ width: "2.5rem", height: "2.5rem" }}
                          >
                            <TiIcons.TiTick
                              style={{ margin: "auto", fontSize: "1rem" }}
                            />
                          </div>
                          <div
                            className="btn waves-effect waves-light red"
                            onClick={() =>
                              pendingDispatch({ type: "reject", id: x._id })
                            }
                            style={{ width: "2.5rem", height: "2.5rem" }}
                          >
                            <ImIcons.ImCross
                              style={{ margin: "auto", fontSize: "0.7rem" }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="center-align amber-text text-darken-4"
                    style={{
                      padding: "2rem",
                      display: "relative",
                      top: "10vh",
                    }}
                  >
                    <object
                      data="./Waiting_Monochromatic.svg"
                      style={{ display: "block", margin: "0 auto" }}
                    >
                      desert image
                    </object>
                    <h6>Waiting on some one are we ?</h6>
                  </div>
                )}
              </div>
            </Tab>
            <Tab title="ADD">
              <div
                className="collection white black-text attached"
                style={{ height: "75vh", padding: "0" }}
              >
                <div className="center-align">
                  <IoIcons.IoMdPersonAdd
                    style={{
                      display: "block",
                      margin: "0 auto",
                      marginTop: "1rem",
                      fontSize: "6rem",
                      color: "#272727",
                    }}
                  />
                  <h3
                    style={{
                      margin: "0",
                      color: "#272727",
                    }}
                  >
                    <b>Add</b>
                  </h3>
                </div>
                <div className="center-align " style={{}}>
                  ID and username in profile section (fourth tab down)
                </div>
                <div
                  className="center-align"
                  style={{
                    width: "100%",
                    marginBottom: "3%",
                    padding: "0",
                    marginTop: "2%",
                  }}
                >
                  <form onSubmit={findFriend}>
                    <div className="friend-search">
                      <input
                        type="text"
                        placeholder="Enter an id example #100893265547281147355 or simply try searching their username"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="search-btn btn amber darken-3 "
                      >
                        <FaIcons.FaSearch /> search
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="collection"
                  style={{
                    borderRight: "none",
                    borderBottom: "none",
                    borderLeft: "none",
                    width: "95%",
                    margin: "0 auto",
                  }}
                >
                  {items.map((x) => (
                    <div
                      href="#!"
                      class="collection-item waves-effect waves-light hover-effect"
                      style={{ margin: "0 5%" }}
                      key={x._id}
                      onClick={() => handleRequest(x._id)}
                    >
                      <section>
                        <img src={x.img} alt={`${x.username}`} />
                        <p>{x.username} </p>
                      </section>
                    </div>
                  ))}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Friends;
