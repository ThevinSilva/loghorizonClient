import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubList from "./SubList";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";

const Sidebar = ({ initialActive }) => {
  const def = {
    dashboard: false,
    friends: false,
    boards: false,
    profile: false,
    devlog: false,
  };
  /**
   * @type Object Contains the five sections of the app as properties
   *    with a Boolean value for each. The Boolean value dictates which
   *    section tab should be active
   */
  const [active, setActive] = useState(def);

  useEffect(() => {
    setActive({ ...def, [initialActive]: true });
  }, [initialActive]);

  return (
    <>
      <nav className="sidebar">
        <section class="sidebar-nav">
          <Link to="/app">
            <div
              className={
                active.dashboard
                  ? `sidebar-item  waves-effect waves-light active `
                  : `sidebar-item  waves-effect waves-light `
              }
              onClick={(e) => setActive({ ...def, dashboard: true })}
            >
              <RiIcons.RiDashboardFill />
              <span>Dashboard</span>
            </div>
          </Link>
          {/* FRIEND */}
          <Link to="/app/f">
            <div
              className={
                active.friends
                  ? `sidebar-item  waves-effect waves-light active `
                  : `sidebar-item  waves-effect waves-light `
              }
              onClick={(e) => setActive({ ...def, friends: true })}
            >
              <FaIcons.FaUserFriends />
              <span>Friends</span>
            </div>
          </Link>
          {/* BOARDS */}
          <Link to="/app/b">
            <div
              className={
                active.boards
                  ? `sidebar-item  waves-effect waves-light active `
                  : `sidebar-item  waves-effect waves-light `
              }
              onClick={() => {
                setActive({ ...def, boards: true });
              }}
            >
              <AiIcons.AiFillPushpin />
              <span>Boards</span>
            </div>
          </Link>
          {/* INFO */}
          <Link to="/app/Profile">
            <div
              className={
                active.profile
                  ? `sidebar-item  waves-effect waves-light active `
                  : `sidebar-item  waves-effect waves-light `
              }
              onClick={() => {
                setActive({ ...def, profile: true });
              }}
            >
              <AiIcons.AiFillInfoCircle />
              <span>Profile</span>
            </div>
          </Link>
          {/* SUPPORT */}
          <Link to="/app/Devlog">
            <div
              className={
                active.devlog
                  ? `sidebar-item  waves-effect waves-light active `
                  : `sidebar-item  waves-effect waves-light `
              }
              onClick={() => {
                setActive({ ...def, devlog: true });
              }}
            >
              <AiIcons.AiFillCode />
              <span>Devlog</span>
            </div>
          </Link>
          {/* lOGOUT */}
          <Link to="/">
            <div
              className="sidebar-item waves-effect"
              style={{ marginTop: "30vh" }}
            >
              <RiIcons.RiLogoutBoxFill />
            </div>
          </Link>
        </section>
      </nav>

      {!active.friends || <SubList active={{ friends: true, boards: false }} />}
      {!active.boards || <SubList active={{ friends: false, boards: true }} />}
    </>
  );
};

export default Sidebar;
