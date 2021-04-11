import React from "react";
import { Link } from "react-router-dom";

const BoardList = ({ boards }) => {
  /**
   * @param {Object} parameterNameHere - fetched board data
   * @return {JSX} list of boards
   */
  /** @bug 0005 */

  return (
    <>
      {boards.map((x) => (
        <div className="collection-item" key={x._id}>
          <div
            style={{
              order: "1",
              display: "flex",
              flexFlow: "nowrap row",
              width: "23%",
            }}
          >
            <img src={x.img} />
            <p>{x.username}</p>
          </div>
          <div
            style={{
              order: "2",
              display: "flex",
              flexFlow: "nowrap row",
              width: "20%",
            }}
          >
            <p>{x.participents.length + x.moderators.length + 1} users</p>
          </div>
          <div
            style={{
              order: "2",
              display: "flex",
              flexFlow: "nowrap row",
              width: "10%",
            }}
          >
            <p>/b/{x._id} </p>
          </div>
          <Link
            className="btn amber darken-3"
            to={`/app/b/${x._id}`}
            style={{ order: "8", width: "10%", margin: "0" }}
          >
            join
          </Link>
        </div>
      ))}
    </>
  );
};

export default BoardList;
