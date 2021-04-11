import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import axios from "axios";
import board from "../API/boardsAPI";

const DevTools = () => {
  const [post, setPost] = useState("");
  const [title, setTitle] = useState("");
  const [byLine, setByline] = useState("");

  const tings = new URLSearchParams(window.location.href);
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("name");

  return (
    !(name === "kiss-shot-acerola-orion-heart-under-blade") || (
      <div>
        <label for="title">title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label for="by">by line</label>
        <input
          type="text"
          name="by"
          value={byLine}
          onChange={(e) => setByline(e.target.value)}
        />
        <MDEditor value={post} onChange={setPost} style={{ height: "25vh" }} />
        <input
          className="btn"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            axios({
              method: "post",
              url: process.env.REACT_APP_SERVER + "/dev/post",
              data: {
                post,
                title,
                byLine,
              },
              withCredentials: true,
            }).then((res) => {
              console.log(res);
            });
          }}
        />
      </div>
    )
  );
};

export default DevTools;
