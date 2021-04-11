import React, { useState, useEffect, useContext, useRef } from "react";
import { profileContext } from "../App";
import { Tabs, Tab } from "react-materialize";
import BoardCreator from "./BoardCreator";
import BoardList from "../components/BoardList";
import CategoryCarousel from "../components/Carousel";
import * as board from "../API/boardsAPI";
import M from "materialize-css";
import "./Boards.css";

const Boards = () => {
  // sets the items
  const [items, setItems] = useState([]);
  // list of boards that I follow
  const [following, setFollowing] = useState({});
  // refference to Category Carousel
  const categoryCarousel = useRef();
  const { boardList } = useContext(profileContext);
  const itemLoader = (category) => {
    console.log(category);
    board.category(category).then((res) => setItems(res.data));
  };
  useEffect(() => {
    M.Carousel.init(categoryCarousel.current, {
      fullWidth: false,
    });
    board.category(undefined).then((res) => setItems(res.data));
    board.listData(boardList).then((res) => {
      //seperates out the fetched board data into an object that's seperated by categories
      let temp = {};
      for (let item of res.data) {
        if (!(item.category in temp)) temp[item.category] = [];
        temp[item.category].push(item);
      }
      setFollowing(temp);
    });
  }, []);

  return (
    <div className="canvas-list fade-in">
      <div className="row">
        <div className="col s12">
          <Tabs className="tab-demo z-index-1" tabOptions={{ swipeable: true }}>
            <Tab title="BROWSE">
              <div
                className="collection white black-text attached "
                style={{
                  height: "75vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <div className="title">
                  <h1>BROWSE</h1>
                </div>

                <div className="center-align">
                  <CategoryCarousel
                    ref={(el) => {
                      categoryCarousel.current = el;
                    }}
                  />
                  <button
                    className="waves-effect waves-orange  btn-flat"
                    onClick={() => {
                      itemLoader(
                        categoryCarousel.current.querySelector(
                          ".carousel-item.z-depth-4.categoryCard.active"
                        ).dataset.value
                      );
                    }}
                  >
                    search
                  </button>
                </div>

                <div className="row">
                  <div
                    className="offset-s1 col s10 collection"
                    style={{
                      overflowY: "auto",
                      height: "30vh",
                      borderBottom: "none",
                      borderRight: "none",
                      borderLeft: "none",
                    }}
                  >
                    <BoardList boards={items} />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab title="FOLLOWING">
              <div
                className="collection white black-text  "
                style={{
                  height: "75vh",
                  margin: "0vh",
                  overflowY: "auto",
                }}
              >
                <div className="title">
                  <h1>FOLLOWING</h1>
                </div>
                <div className="center-align">
                  {Object.keys(following).length > 0 ? (
                    Object.keys(following).map((x) => (
                      <div>
                        <h4 className="title">{x.toUpperCase()}</h4>
                        <section
                          className=""
                          style={{ width: "60vw", marginLeft: "6%" }}
                        >
                          <BoardList boards={following[x]} />
                        </section>
                      </div>
                    ))
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
                        data="./Mountain_Monochromatic.svg"
                        style={{ display: "block", margin: "0 auto" }}
                      >
                        desert image
                      </object>
                      <h6>lone wolf huh?</h6>
                    </div>
                  )}
                </div>
              </div>
            </Tab>
            {/* <Tab title="JOIN"></Tab> */}
            <Tab title="CREATE">
              <BoardCreator />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Boards;
