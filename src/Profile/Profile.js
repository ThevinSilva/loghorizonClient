import React, { useContext } from "react";
import { profileContext } from "../App";
import "./profile.css";
import * as AiIcons from "react-icons/ai";
import * as ImIcons from "react-icons/im";
import { docsData } from "../API/friendAPI";
import fileDownload from "js-file-download";
import ProfileContent from "../components/ProfileContent";
/**
 * Requests Userdata from the back end which get's converted into a json file
 *
 * @callback Profile~downloadDocsCallback
 */
const downloadDocs = () => {
  docsData().then((res) => {
    fileDownload(res.data, "logHorizonUserInfo.json");
  });
};

/**
 *  Profile Section of the Web app. Used to Display Google Cloud API data
 *
 * @component
 * @example
 * const userData = useContext(profileContext)
 * return(
 * <div>
 *  <p>userData._id</p>
 *  <p>userData.username</p>
 *  <p>userData.firstName.length</p>
 *  <p>userData.boardList.length</p>
 *  <p>userData.lastName</p>
 *  <p>userData.createdAt</p>
 * </div>
 * )
 *
 */
const Profile = () => {
  /** contains all the variables that are used to populate the different fields in  */
  const data = useContext(profileContext);
  let { username, firstName, createdAt, img } = data;

  /**@type {string} converts from Date type to string*/
  createdAt = new Date(createdAt).toDateString();

  return (
    <div className="canvas" style={{ overflow: "hidden" }}>
      <div class="row">
        <div class="col s12 center-align fade-in">
          <h2 style={{ margin: "0" }}>
            {`Hello ${firstName || username}`.toUpperCase()}
          </h2>
          <p className="light">WELCOME TO LOGHORIZON</p>
        </div>
      </div>
      <div className="row">
        {/* ------------------------------------------------------------ About ------------------------------------------------------------ */}
        <div className="col s5 push-s7  fade-in">
          <div className="card white" style={{ height: "41vh" }}>
            <div className="card-content light black-text">
              <span className="card-title left-align ">About</span>
              <span style={{ marginLeft: "3%", fontWeight: "bold" }}>
                Functionality{" "}
              </span>
              <p style={{ marginLeft: "4%" }}>
                {" "}
                Messages sent through chat is volatile. Meaning it's not stored
                anywhere. Boards contain persistent data which does get stored.
                Google API is used to get user info such as profile picture
              </p>
              <span style={{ marginLeft: "3%", fontWeight: "bold" }}>
                Techonologies{" "}
              </span>
              <p style={{ marginLeft: "4%" }}>- MongoDB </p>
              <p style={{ marginLeft: "4%" }}>- ExpressJs </p>
              <p style={{ marginLeft: "4%" }}>- NodeJs </p>
              <p style={{ marginLeft: "4%" }}>- ReactJs </p>
              <p style={{ marginLeft: "4%" }}>- Materialize</p>
              <p style={{ marginLeft: "4%" }}>- Socket.io</p>
              <div class="card-action right-align">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://github.com/ThevinSilva";
                  }}
                  style={{ margin: "0" }}
                  className="btn grey darken-4 waves-effect waves-light"
                >
                  <AiIcons.AiFillGithub
                    style={{ fontSize: "1rem", color: "white" }}
                  />{" "}
                  Github{" "}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "https://youtu.be/h6DNdop6pD8";
                  }}
                  style={{ margin: "0", marginLeft: "4%" }}
                  className="btn red darken-1 waves-effect waves-light "
                >
                  <ImIcons.ImYoutube
                    style={{ fontSize: "1rem", color: "white", margin: "0" }}
                  />{" "}
                  Youtube{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------ user data ------------------------------------------------------------ */}
        <div class="col s7 pull-s5 " style={{ paddingBottom: "none" }}>
          <div class="card white fade-in" style={{ height: "41vh" }}>
            <div class="card-content light">
              <span class="card-title left-align black-text">User Data</span>
              <div className="row">
                <div className=" col s9 push-s3">
                  <ProfileContent data={data} />
                </div>
                <div className="col s3 pull-s9">
                  <img
                    className="profile-pic"
                    style={{ marginTop: "2rem" }}
                    src={img}
                    alt={`${username}'s profile `}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        {/* ------------------------------------------------------------ About ------------------------------------------------------------ */}
        <div class="col s6 push-s6 fade-in">
          <div class="card white black-text">
            <div class="card-content light ">
              <span class="card-title left-align ">JSON file download </span>
              <p style={{ width: "80%", marginLeft: "5%" }}>
                Want to know what we're selling sure here you go. One sec, just
                let me redact all the juicy metadata that we have on you so we
                know just what to sell you and control your disposable income
                and entire livelyhood while we're at it{" "}
              </p>
            </div>
            <div class="card-action right-align">
              {/* RUN FIND for PROFILE THEN SEND JSON FILE  */}
              <button
                style={{ margin: "0" }}
                className="btn amber  darken-3 waves-effect waves-light "
                href="#"
                onClick={() => {
                  downloadDocs();
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
        <div class="col s6 pull-s6 fade-in">
          <div class="card white darken-1 black-text">
            <div class="card-content light white">
              <span class="card-title left-align ">
                Data Protection & Privacy
              </span>
              <p style={{ width: "80%", marginLeft: "5%" }}>
                Ye man it's not like we're totaling selling your data behind
                your backs to advertisers or anything. What's that you were
                looking up vibrators and now all your socials are flooded with
                "charlie's moby huge". Hey man not my problem
              </p>
            </div>
            <div class="card-action right-align">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "https://youtu.be/dWNvlyycWzQ";
                }}
                style={{ margin: "0" }}
                className="btn waves-effect waves-light amber darken-3"
                href="#"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
