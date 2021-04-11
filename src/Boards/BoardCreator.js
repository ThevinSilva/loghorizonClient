import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as TiIcons from "react-icons/ti";
import React, { Component } from "react";
import M from "materialize-css";
import "./Boards.css";
import { Select, Textarea, Modal, Button, Icon } from "react-materialize";
import { searchData, submitBoardData, checkBoardName } from "../API/boardsAPI";
import Uploader from "./Upload";
import CategoryCarousel from "../components/Carousel";

class BoardCreator extends Component {
  constructor() {
    super();
    this.state = {
      // QUERY MONGODB
      friendSearch: "",
      // PERMAITEMS contains things the user has SELECTED
      items: {},
      permaItems: [],
      // CAROUSEL CONTROL VARIABLES
      currentPage: 1,
      enableNext: true,
      enablePrev: false,
      submit: false,
      // BOARD DATA
      image: null,
      boardName: "",
      boardNameCheckValidation: null,
      descLen: 0,
      visibility: "Private",
      password: null,
      passwordCheck: "",
      passwordCheckValidation: null,
      // switch values in SECURITY
      passwordProtection: true,
      whitelist: false,
      imageRawBlob: "",
      response: null,
    };
  }

  redirectToPage = () => {
    window.location.replace(`./b/${this.state.response.data.id}`);
  };
  componentDidMount() {
    M.Carousel.init(this.mainCarousel, {
      duration: 40,
      fullWidth: true,
      numVisible: 5,
    });
    M.Carousel.init(this.categoryCarousel, {
      fullWidth: false,
    });

    //function for when board is created and u need to redirrect

    M.Tooltip.init(document.querySelectorAll(".tooltipped"));

    //Instance Plugin
    this.instance = M.Carousel.getInstance(this.mainCarousel);
    this.handleSubmit.bind(this);
  }

  handleRequest(id, val, e, order) {
    // 1 - moderator
    // 2 - whiteList
    // 3 - blackList
    e.preventDefault();
    this.setState({
      permaItems: [...this.state.permaItems, { id, ...val, order }],
    });
  }

  setImage = (val) => {
    this.setState({ image: val });
  };

  componentDidUpdate(prevProps, prevState) {
    // friend-search
    if (prevState.friendSearch !== this.state.friendSearch) {
      searchData(this.state.friendSearch).then((res) => {
        this.setState({ items: res.data });
      });
    }
    // boardName-check
    if (prevState.boardName !== this.state.boardName) {
      checkBoardName(this.state.boardName).then((res) => {
        this.setState({ boardNameCheckValidation: !res.data });
        if (res.data) {
          M.toast({
            html: `<span style="color:#ff8a80;"> Board Name Exists </span>`,
            classes: "boardName",
            displayLength: 1000000000,
          });
        } else {
          try {
            M.Toast.getInstance(document.querySelector(".boardName")).dismiss();
          } catch (e) {
            console.log(e);
          }
        }
      });
    }
    if (prevState.currentPage !== this.state.currentPage) {
      // current page tracker
      if (1 < this.state.currentPage < 4)
        this.setState({ enableNext: true, enablePrev: true, submit: false });
      if (this.state.currentPage === 4)
        this.setState({ enableNext: true, enablePrev: true, submit: true });
      if (this.state.currentPage === 1)
        this.setState({ enableNext: true, enablePrev: false });
    }
    // 'pasword-check'
    if (prevState.passwordCheck !== this.state.passwordCheck) {
      if (this.state.password !== this.state.passwordCheck)
        this.setState({ passwordCheckValidation: false });
      else this.setState({ passwordCheckValidation: true });
    }
    // check description
    if (this.state.descLen >= 280 && prevState.descLen < 280) {
      // toast for length too big
      M.toast({
        html:
          '<span style="color:#ff8a80;">ALERT: Description must be less than 280 characters</span>',
      });
      console.log("reduce it to 280 or less");
    }
    // pasword-validation

    if (
      typeof this.state.password === "string" &&
      prevState.password === null
    ) {
      console.log("this is spawn");
      M.toast({
        html: '<span style="color:#ff8a80;"> minimum 8 characters </span>',
        displayLength: 1000000000,
        classes: "passwordLength",
      });

      M.toast({
        html: '<span style="color:#ff8a80;"> use at least one number </span>',
        displayLength: 1000000000,
        classes: "passwordNumber",
      });
    }

    // decreasing
    if (
      typeof this.state.password === "string" &&
      typeof prevState.password === "string"
    ) {
      console.log("this is necceary");
      if (this.state.password.length < 8 && prevState.password.length >= 8) {
        // create toast
        M.toast({
          html: '<span style="color:#ff8a80;"> minimum 8 characters </span>',
          displayLength: 1000000000,
          classes: "passwordLength",
        });
      }

      // increasing over 8
      if (this.state.password.length >= 8 && prevState.password.length < 8) {
        // destroy toast
        try {
          M.Toast.getInstance(
            document.querySelector(".passwordLength")
          ).dismiss();
        } catch (e) {
          console.log(e);
        }
      }

      // decreasing under 8
      if (
        this.state.password.match(/[0-9]/g) &&
        !prevState.password.match(/[0-9]/g)
      ) {
        // create toast
        try {
          M.Toast.getInstance(
            document.querySelector(".passwordNumber")
          ).dismiss();
        } catch (e) {
          console.log(e);
        }
      }
      // number back
      if (
        !this.state.password.match(/[0-9]/g) &&
        prevState.password.match(/[0-9]/g)
      ) {
        // create toast
        M.toast({
          html:
            '<span style="color:#ff8a80;">  use at least one number </span>',
          displayLength: 1000000000,
          classes: "passwordNumber",
        });
      }
    }

    if (this.state.passwordProtection !== prevState.passwordProtection) {
      if (!this.state.passwordProtection) {
        try {
          M.Toast.getInstance(
            document.querySelector(".passwordNumber")
          ).dismiss();

          M.Toast.getInstance(
            document.querySelector(".passwordNumber")
          ).dismiss();
        } catch (e) {
          console.log(e);
        }
      }
    }

    if (prevState.response == null && this.state.response) {
      if (this.state.response.status === 200) {
        M.toast({
          html: `<span class="text-green text-accent-3">${this.state.response.data.message}</span><button onClick="redirectToPage"class="btn-flat toast-actiont green accent-3">open</button>`,
          displayLength: 200,
          completeCallback: this.redirectToPage,
        });
      } else {
        M.toast({
          html: `<span class="text-red text-accent-3">${this.state.response.data.message}</span><button class="btn-fla toast-actiont red accent-3">Undo</button>`,
          displayLength: 200,
        });
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // CATEGORY using the active class in the carousel
    const name = this.state.boardNameCheckValidation
      ? this.state.boardName
      : null;
    console.log(this.state.boardNameCheckValidation);
    console.log(name);
    if (name === null) {
      M.toast({
        html:
          '<span style="color:#ff8a80">ALERT: Please Change Board Name </span>',
      });
      return;
    }

    if (!/^[a-z0-9]+$/i.test(name)) {
      M.toast({
        html:
          '<span style="color:#ff8a80">ALERT: boardname must be alphanumerics </span>',
      });
      return;
    }
    let description = document.querySelector("#description").value;
    let category;
    try {
      category = this.categoryCarousel.querySelector(
        "div.carousel-item.z-depth-4.categoryCard.active"
      ).dataset.value;
    } catch (e) {
      console.log(e);
      M.toast({
        html:
          '<span style="color:#ff8a80">ALERT: Pick a Category | </span><span style="font-size:0.75rem;"> click on the middle if not present</span>',
      });
      // stops submition
      return;
    }
    let blackList = [];
    let whiteListOrParticipents = [];
    let moderators = [];

    // parse the permaItems into 3 lists
    for (let item of this.state.permaItems) {
      // Moderator
      switch (item.order) {
        case 1:
          moderators.push(item.id);
          break;
        case 2:
          whiteListOrParticipents.push(item.id);
          break;
        default:
          blackList.push(item.id);
          break;
      }
    }
    // nested Validation Structure in backwards order of user experience

    if (this.state.image !== null) {
      if (name) {
        if (this.state.descLen <= 280) {
        } else {
          M.toast({
            html:
              '<span style="color:#ff8a80">ALERT: Description must be at most 280 char</span>',
          });
          return;
        }
      } else {
        M.toast({
          html: '<span style="color:#ff8a80">ALERT: Enter Board Name </span>',
        });
        return;
      }
    } else {
      // IMAGE MISSING
      M.toast({
        html: '<span style="color:#ff8a80">ALERT: Image Missing </span>',
      });
      return;
    }

    let boardData = {
      description,
      name,
      category,
      // ban list
      blackList,
      participents: whiteListOrParticipents,
      moderators,
      whitelist: this.state.whitelist,
      visibility: this.state.visibility,
    };

    if (this.state.passwordProtection) {
      if (this.state.password) {
        if (
          this.state.password.match(/[0-9]/g) &&
          this.state.password.length >= 8 &&
          this.state.passwordCheckValidation
        ) {
          // plain text
          boardData.password = this.state.password;
        } else {
          M.toast({
            html:
              '<span style="color:#ff8a80">ALERT: Password or Passwords check earlier alerts or reload page</span>',
          });
          return;
        }
      } else {
        M.toast({
          html: '<span style="color:#ff8a80">ALERT: Password Missing</span>',
        });
        return;
      }
    } else {
      boardData.password = "";
    }
    // change blob to base64 string
    // NOTE implement cloudinary here to prevent large packket size

    boardData.image = this.state.image;
    submitBoardData(boardData).then((res) => this.setState({ response: res }));
  };

  fileSelectedHandler = (event) => {
    this.setState({
      image: URL.createObjectURL(event.target.files[0]),
      imageRawBlob: event.target.files[0],
    });
    console.log(event.target.files[0]);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div
          ref={(Carousel) => {
            this.mainCarousel = Carousel;
          }}
          class="carousel carousel-slider collection"
          style={{ height: "75vh", margin: "0vh" }}
        >
          {/* ------------------------------------------------ NAVIGATION ------------------------------------------------ */}

          <div class="carousel-fixed-item row">
            {/* grayed out unless fully validated */}
            {/* grayed out buttons till fully validated */}
            <div className="col s2 offset-s1">
              {/* sets current page which we then use to prevent a user to go to another page */}
              {this.state.enablePrev ? (
                <button
                  class="btn waves-effect amber darken-1 waves-light "
                  onClick={(e) => {
                    e.preventDefault();
                    this.instance.prev();
                    this.setState({ currentPage: this.state.currentPage - 1 });
                  }}
                >
                  prev
                </button>
              ) : (
                <button
                  class="btn white grey-text darken-text-2"
                  onClick={(e) => e.preventDefault()}
                >
                  prev
                </button>
              )}
            </div>
            <div className="offset-s7 col s2">
              {this.state.enableNext ? (
                this.state.submit ? (
                  <Button
                    node="button"
                    type="submit"
                    waves="light"
                    className="amber darken-1"
                    onClick={this.response}
                  >
                    Submit
                    <Icon right>send</Icon>
                  </Button>
                ) : (
                  <button
                    class="btn waves-effect amber darken-1  waves-light "
                    onClick={(e) => {
                      e.preventDefault();
                      this.instance.next();
                      this.setState({
                        currentPage: this.state.currentPage + 1,
                      });
                    }}
                  >
                    next
                  </button>
                )
              ) : (
                <button
                  class="btn white grey-text darken-text-2"
                  onClick={(e) => e.preventDefault()}
                >
                  next
                </button>
              )}
            </div>
          </div>
          <div class="carousel-item white black-text" href="#one!">
            {/* ------------------------------------------------ CUSTOMIZE ------------------------------------------------ */}

            <div className="center-align">
              <h2>
                <b>Customize your Board</b>
              </h2>
              Give your new Board some personality with a name and an icon. You
              may change it later.
              {/* IMAGE CROPPING MODAL/POP UP */}
              <Modal
                className="black-text"
                actions={[
                  <Button flat modal="close" node="button">
                    close
                  </Button>,
                ]}
                bottomSheet={false}
                fixedFooter
                id="Modal-0"
                open={false}
                options={{
                  dismissible: true,
                  endingTop: "10%",
                  inDuration: 250,
                  onCloseEnd: null,
                  onCloseStart: null,
                  onOpenEnd: null,
                  onOpenStart: null,
                  opacity: 0.8,
                  outDuration: 250,
                  preventScrolling: true,
                  startingTop: "4%",
                }}
                // FUTURE PATCH RESTRICT THE MODAL TO JUST CANVAS-LIST
                // root={typeof window !== undefined ? document : null}
                trigger={
                  this.state.image ? (
                    <img
                      src={this.state.image}
                      alt="your mom"
                      style={{
                        display: "block",
                        margin: "1rem auto",
                        height: "8rem",
                        border: "0.5rem dashed #272727",
                        borderRadius: "50%",
                        padding: "0.25rem",
                        color: "#272727",
                      }}
                    />
                  ) : (
                    <AiIcons.AiFillCamera
                      style={{
                        display: "block",
                        margin: "1rem auto",
                        fontSize: "8rem",
                        border: "0.5rem dashed #272727",
                        borderRadius: "50%",
                        padding: "0.5rem",
                        color: "#272727",
                      }}
                    />
                  )
                }
              >
                <>
                  {this.state.image ? (
                    <Uploader
                      image={this.state.image}
                      setImage={this.setImage}
                    />
                  ) : (
                    <div style={{ height: "40vh" }}>
                      <label
                        for="image"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        <div
                          style={{
                            order: "1",
                            color: "#272727",
                            margin: "0 auto",
                          }}
                        >
                          <AiIcons.AiOutlineCloudUpload
                            style={{ fontSize: "8rem" }}
                          />
                          <br />
                          <h4>Click Me</h4>
                        </div>
                      </label>
                      <input
                        type="file"
                        id="image"
                        style={{ opacity: "0" }}
                        onChange={this.fileSelectedHandler}
                      />
                    </div>
                  )}
                </>
              </Modal>
            </div>
            <div class="row">
              <div className="col s3 offset-s3 input-field">
                <label for="boardName">Board Name:</label>
                <input
                  className=" tooltipped"
                  data-position="top"
                  data-tooltip="a-z or 0-9 no spaces"
                  value={this.state.boardName}
                  onChange={(e) => {
                    this.setState({ boardName: e.target.value });
                  }}
                  type="text"
                  name="boardName"
                />
              </div>
              <div className="col s3  ">
                <Select
                  xl={12}
                  icon={<AiIcons.AiFillEye />}
                  id="visibility"
                  onChange={(e) => {
                    this.setState({ visibility: e.target.value });
                  }}
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </Select>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s6 offset-s3">
                <Textarea
                  xl={12}
                  data-length={280}
                  id="description"
                  label="Description"
                  onChange={(e) => {
                    this.setState({ descLen: e.target.value.length });
                  }}
                />
              </div>
            </div>
          </div>
          {/* ------------------------------------------------ SECURITY ------------------------------------------------ */}
          <div class="carousel-item white black-text" href="#two!">
            <div className="center-align" style={{ marginBottom: "1rem" }}>
              <BsIcons.BsFillShieldLockFill
                style={{
                  display: "block",
                  margin: "1rem auto",
                  fontSize: "8rem",
                  color: "#272727",
                }}
              />
              <h2 className="">
                <b>Security</b>
              </h2>
              <span style={{ fontSize: "1.1rem" }}>
                Make sure your board doesn't wind up in the wrong hands
              </span>
            </div>
            <div class="switch row">
              <label className="col s3 offset-s4" style={{ fontSize: "1rem" }}>
                Want to password protect the board?
              </label>
              <label
                className="col s2 tooltipped"
                data-position="top"
                data-tooltip="default 'on' if private"
              >
                off
                {this.state.visibility === "Private" ? (
                  <input
                    id="password-checker"
                    checked={this.state.passwordProtection}
                    type="checkbox"
                    disabled
                    className="check-box"
                  />
                ) : (
                  <input
                    type="checkbox"
                    className="check-box"
                    checked={this.state.passwordProtection}
                    onChange={(e) => {
                      this.setState({ passwordProtection: e.target.checked });
                    }}
                  />
                )}
                <span class="lever"></span>
                on
              </label>
            </div>
            {!this.state.passwordProtection || (
              <>
                {" "}
                <div class="row">
                  <div class="input-field col s4 offset-s4">
                    <input
                      id="password"
                      type="password"
                      value={this.state.password}
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                    />
                    <label for="password">Password</label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s4 offset-s4">
                    <input
                      id="password-check"
                      className={
                        this.state.passwordCheckValidation === null
                          ? ""
                          : this.state.passwordCheckValidation
                          ? "valid"
                          : "invalid"
                      }
                      type="password"
                      value={this.state.passwordCheck}
                      onChange={(e) => {
                        this.setState({ passwordCheck: e.target.value });
                      }}
                    />
                    <label for="password-check">re-enter Password</label>
                  </div>
                </div>{" "}
              </>
            )}
            <div class="switch row">
              <label className="col s3 offset-s4" style={{ fontSize: "1rem" }}>
                Turn on white list?
              </label>
              <label
                className="col s2 tooltipped"
                data-position="top"
                data-tooltip="only whitelisted people can join the board"
              >
                off
                <input
                  type="checkbox"
                  className="check-box"
                  checked={this.state.whitelist}
                  onChange={(e) => {
                    this.setState({ whitelist: e.target.checked });
                  }}
                />
                <span class="lever"></span>
                on
              </label>
            </div>
          </div>
          <div class="carousel-item white black-text z-depth-0" href="#three!">
            {/* ------------------------------------------------ PARTICIPENT ------------------------------------------------ */}

            <div className="center-align">
              <AiIcons.AiOutlineUnorderedList
                style={{
                  display: "block",
                  margin: "1rem auto",
                  fontSize: "6rem",
                  color: "#272727",
                }}
              />
              <h2>
                <b>Participents</b>
              </h2>
            </div>
            <div className="row">
              <div className="col s4 offset-s4 center">
                <input
                  type=" text"
                  id="friendSearch"
                  onChange={(e) =>
                    this.setState({ friendSearch: e.target.value })
                  }
                />
                <label for="friendSearch">
                  <FaIcons.FaSearch style={{ fontSize: "1rem" }} />
                </label>
              </div>
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
                {this.state.permaItems.map((x) => (
                  <div class="collection-item" key={x._id}>
                    <div
                      style={{
                        order: "1",
                        display: "flex",
                        flexFlow: "nowrap row",
                        width: "50%",
                      }}
                    >
                      {x.order === 1 ? (
                        <RiIcons.RiSwordLine
                          style={{ fontSize: "2rem", margin: "auto 0" }}
                        />
                      ) : x.order === 2 ? (
                        <TiIcons.TiTick
                          style={{ fontSize: "2rem", margin: "auto 0" }}
                        />
                      ) : (
                        <AiIcons.AiOutlineStop
                          style={{ fontSize: "2rem", margin: "auto 0" }}
                        />
                      )}
                      <img src={x.img} alt={`${x.username}`} />
                      <p>{x.username}</p>
                    </div>
                    <div className="btn-container ">
                      <Button
                        className="orange accent-3"
                        node="button"
                        tooltip="participent or whitelist"
                        waves="light"
                        onClick={(e) => {
                          e.preventDefault();
                          this.setState({
                            permaItems: this.state.permaItems.filter(
                              (i) => i.id !== x.id
                            ),
                          });
                        }}
                      >
                        remove
                      </Button>
                      {/* black list if black list is on */}
                    </div>
                  </div>
                ))}
                {/* filter out the search with perma items  */}
                {Object.keys(this.state.items)
                  .filter(
                    (x) =>
                      !Array.from(this.state.permaItems, (x) => x.id).includes(
                        x
                      )
                  )
                  .map((x) => (
                    <div class="collection-item" key={this.state.items[x]._id}>
                      <section>
                        <img
                          src={this.state.items[x].img}
                          alt={`${this.state.items[x].username}`}
                        />
                        <p>{this.state.items[x].username}</p>
                      </section>
                      {/* active if white list is on */}
                      <div className="btn-container">
                        <Button
                          className="green accent-3"
                          node="button"
                          tooltip="participent or whitelist"
                          waves="light"
                          onClick={(e) =>
                            this.handleRequest(x, this.state.items[x], e, 2)
                          }
                        >
                          <TiIcons.TiTick />
                        </Button>
                        {/* black list if black list is on */}
                        <Button
                          className="red accent-3"
                          node="button"
                          tooltipOptions={{ position: "top" }}
                          tooltip="blacklist"
                          waves="light"
                          onClick={(e) =>
                            this.handleRequest(x, this.state.items[x], e, 3)
                          }
                        >
                          <AiIcons.AiOutlineStop />
                        </Button>
                        {/* moderator button */}
                        <Button
                          className="black"
                          node="button"
                          tooltip="Moderator"
                          waves="light"
                          onClick={(e) =>
                            this.handleRequest(x, this.state.items[x], e, 1)
                          }
                        >
                          <RiIcons.RiSwordLine style={{ fontSize: "1.1rem" }} />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* this should only exist if public  */}
          <div class="carousel-item white black-text z-depth-0" href="#five!">
            <div className="center-align">
              {/* ------------------------------------------------ CATEGORY ------------------------------------------------ */}
              <h2>
                <b>Category</b>
              </h2>
              Pick what Category your board belongs too
            </div>
            <div className="center-align">
              <CategoryCarousel
                ref={(el) => {
                  this.categoryCarousel = el;
                }}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default BoardCreator;
