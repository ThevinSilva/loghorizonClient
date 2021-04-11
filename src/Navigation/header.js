import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as GrIcons from "react-icons/gr";
import * as IoIcons from "react-icons/io";
import * as CgIcons from "react-icons/cg";
import * as MdIcons from "react-icons/md";
import { profileContext } from "../App";

const StatusBar = styled.div` 
    background-color: #ff4e00;
    background-image: linear-gradient(315deg, #ff4e00 0%, #ec9f05 74%);
    width: 10%;
    height  15vh;
    display: flex;
    justify-content: center;
    position: absolute;
    left:90%;
    top: ${({ sidebar }) => (sidebar ? "10vh" : "-100%")};
    transition: 40ms;
    z-index: 6;
`;

const StatusbarWrap = styled.div`
  width: 100%;
`;

const StatusText = styled.p`
  color: white;
  font-size: 1rem;
`;

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const profileData = useContext(profileContext);

  const toggleSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <div className="header">
        <Link className="status-icon">
          {!sidebar ? (
            <IoIcons.IoIosArrowDown
              onClick={toggleSidebar}
              style={{ marginRight: "2rem" }}
            />
          ) : (
            <IoIcons.IoIosArrowUp
              onClick={toggleSidebar}
              style={{ marginRight: "2rem" }}
            />
          )}
          {/* notifications add in future */}
          <img
            src={profileData.img}
            style={{ height: "7vh", marginRight: "1rem" }}
            alt={` pfp of ${profileData.firstName}`}
          />
          {/* changing profile picture  */}
        </Link>
      </div>
      <StatusBar sidebar={sidebar}>
        <StatusbarWrap>
          <Link className="status-icon waves-effect waves-light" to="#">
            <GrIcons.GrStatusCriticalSmall
              style={{ color: "green", fontSize: "1rem", marginRight: "1rem" }}
            />
            <StatusText>online</StatusText>
          </Link>
          <Link className="status-icon waves-effect waves-light" to="#">
            <GrIcons.GrStatusCriticalSmall
              style={{ color: "yellow", fontSize: "1rem", marginRight: "1rem" }}
            />
            <StatusText>away</StatusText>
          </Link>
          <Link className="status-icon waves-effect waves-light" to="#">
            <MdIcons.MdDoNotDisturbOn
              style={{ color: "red", fontSize: "1rem", marginRight: "1rem" }}
            />
            <StatusText>busy</StatusText>
          </Link>
        </StatusbarWrap>
      </StatusBar>
    </>
  );
};

export default Header;
