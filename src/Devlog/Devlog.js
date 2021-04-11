import React, { useEffect, useState } from "react";
import axios from "axios";
import M from "materialize-css";
import ReactMarkdown from "react-markdown";
import { getDate } from "../helper";
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

const Devlog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const elems = document.querySelectorAll(".collapsible");
    const instances = M.Collapsible.init(elems);

    //fetch list of DevLog
    axios({
      method: "get",
      url: process.env.REACT_APP_SERVER + "/dev/log",
      withCredentials: true,
    }).then((res) => setLogs(res.data));
  }, []);

  return (
    <div className="canvas">
      <div
        className="collection white fade-in"
        style={{
          padding: "0",
          margin: "0",
          borderTop: "none",
          borderBottom: "none",
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        <h1 className="title">DEVLOG</h1>
        <ul class="collapsible black-text">
          {logs.reverse().map((x) => (
            <li>
              <div
                class="collapsible-header "
                style={{
                  display: "flex",
                  flexFlow: "row nowrap",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{x.title}</span>
                <div className="right ">
                  <span
                    style={{
                      fontSize: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {getDate(x.date)}
                  </span>
                </div>
              </div>
              <div class="collapsible-body grey darken-3 white-text">
                <ReactMarkdown renderers={renderers} children={x.post} />

                <br />
                <span style={{ position: "absolute", right: "5rem" }}>
                  {x.byLine}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Devlog;
