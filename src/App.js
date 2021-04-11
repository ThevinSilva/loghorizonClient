import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./Dashboard/Dashboard";
import NotFound from "./Dashboard/NotFound";
import Boards from "./Boards/Boards";
import Devlog from "./Devlog/Devlog";
import DevTools from "./DevTools/DevTools";
import Friends from "./Friends/Friends";
import Profile from "./Profile/Profile";
import LandingPage from "./LandingPage/LandingPage";
import AuthenticatePlease from "./LandingPage/AuthenticatePlease";
import NavBar from "./Navigation/Navigation";
import Chat from "./Friends/chat/chat";
import ViewBoard from "./Boards/viewBoards";
import "materialize-css/dist/css/materialize.min.css";
import "./styles.css";
export const profileContext = React.createContext();

export default function App() {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    axios
      .get("cookie-parse", {
        withCredentials: true,
        baseURL: process.env.REACT_APP_SERVER,
      })
      .then((res) => {
        console.log(res);
        setAuth(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <profileContext.Provider value={{ ...auth.data }}>
        <Router>
          {!auth.isAuthenticated || (
            <>
              <Route path="/app" component={NavBar} />
              <Switch>
                <Route exact path="/app" component={Dashboard} />
                <Route path="/app/Profile" component={Profile} />
                <Route path="/app/Devlog" component={Devlog} />
                {/* chat route */}
                <Route path="/app/b/:id" component={ViewBoard} />
                {/* chat route */}
                <Route path="/app/f/chat/:id" component={Chat} />
                <Route path="/app/b" component={Boards} />
                <Route path="/app/f" component={Friends} />
                <Route path="/app/" component={NotFound} />
              </Switch>
            </>
          )}
          <Switch>
            <Route exact path="/dev/logger" component={DevTools} />
            <Route path="/app" component={AuthenticatePlease} />
            <Route path="/" component={LandingPage} />
          </Switch>
        </Router>
      </profileContext.Provider>
    </>
  );
}
