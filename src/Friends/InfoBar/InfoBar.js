import React, { useContext } from "react";
import "./InfoBar.css";
import * as AiIcons from "react-icons/ai";
import { profileContext } from "../../App";
// import closeIcon from '../icons/closeIcon.png';
// import onlineIcon from '../icons/onlineIcon.png';

const InfoBar = (props) => {
  const { room, img } = props.value;
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img style={{ height: "5vh" }} src={img} alt="onlineImage" />

        <span>{room.toUpperCase()}</span>
      </div>
      <div className="rightInnerContainer" onClick={props.toggle}>
        {/* add rotation animation make it look clean */}
        <AiIcons.AiFillInfoCircle
          style={{ fontSize: "2rem", margin: "auto 0" }}
        />
      </div>
    </div>
  );
};

export default InfoBar;
