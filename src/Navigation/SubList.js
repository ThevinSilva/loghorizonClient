import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { profileContext } from "../App";
import * as FriendAPI from "../API/friendAPI";
import * as BoardAPI from "../API/boardsAPI";

const SubList = (props) => {
  const [valList, setValList] = useState("loading");
  const [current, setCurrent] = useState("");
  //  if friends isn't active then boards is active
  const { friends, boards } = props.active;
  const profileData = useContext(profileContext);
  useEffect(() => {
    let path = window.location.pathname.split("/");
    if (friends) {
      FriendAPI.listData(profileData.friendsList).then((res) =>
        setValList(res.data)
      );
      if (path.length === 5) setCurrent(path[4]);
      else setCurrent("");
    }
    if (boards) {
      BoardAPI.listData(profileData.boardList).then((res) =>
        setValList(res.data)
      );
      if (path.length === 4) setCurrent(path[3]);
      else setCurrent("");
    }
  }, [window.location.href]);

  if (valList.length === 0) {
    return (
      <div className="sub-list">
        <div
          style={{ padding: "0.5rem", margin: "auto 0", textAlign: "center" }}
        >
          {friends
            ? "looks like you don't have any friends... "
            : "looks like you aren't part of any boards..."}
        </div>
      </div>
    );
  }

  if (valList === "loading") {
    return (
      <div className="sub-list">
        <div class="loader"></div>
      </div>
    );
  }

  if (valList.length > 0) {
    return (
      <div className="sub-list">
        {valList.map((x) => (
          <Link
            className={
              x._id.toLowerCase() === current.toLowerCase()
                ? "list-items item-active waves-effect"
                : "list-items waves-effect"
            }
            to={friends ? `/app/f/chat/${x._id}` : `/app/b/${x._id}`}
            key={x._id}
          >
            <img src={x.img} alt={`${x.username}`} />
            <p>{x.username}</p>
          </Link>
        ))}
      </div>
    );
  }
};

export default SubList;
