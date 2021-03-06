import React, { useEffect, useState } from "react";
import * as AiIcons from "react-icons/ai";
import * as FcIcons from "react-icons/fc";
import { Modal, Button } from "react-materialize";
import axios from "axios";
import "./LandingPage.css";

const LandingPage = () => {
  const [fade, setFade] = useState(false);
  const [video, setVideo] = useState(null);

  const loginWithRedirect = () => {
    window.location.assign(process.env.REACT_APP_SERVER + "/auth/google");
  };

  const gitHubRepo = () => {
    window.location.assign("https://github.com/ThevinSilva");
  };
  useEffect(() => {
    axios({
      url: window.location.protocol + "//" + window.location.host + "/vid.mp4",
      method: "GET",
      responseType: "blob",
    }).then((res) => {
      setVideo(URL.createObjectURL(res.data));
    });
  }, []);

  useEffect(() => {
    if (video !== null) {
      let temp = document.querySelector("#vid");
      temp.play();
      setTimeout(() => {
        setFade(true);
      }, 5000);
    }
  }, [video]);

  return video === null ? (
    <div className="main-loader"></div>
  ) : (
    <div className="z-index-0">
      <video id="vid" autoplay muted>
        <source src={video} type="video/mp4" />
      </video>
      <svg
        id="logo"
        width="1001"
        height="105"
        viewBox="0 0 1001 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.41602 2.2H12.072V93.784H68.52V103H1.41602V2.2Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M128.308 103.864C118.324 103.864 109.252 101.656 101.092 97.24C93.0281 92.728 86.6921 86.584 82.0841 78.808C77.5721 71.032 75.3161 62.296 75.3161 52.6C75.3161 42.904 77.5721 34.168 82.0841 26.392C86.6921 18.616 93.0281 12.52 101.092 8.104C109.252 3.592 118.324 1.336 128.308 1.336C138.292 1.336 147.268 3.544 155.236 7.96C163.3 12.376 169.636 18.52 174.244 26.392C178.852 34.168 181.156 42.904 181.156 52.6C181.156 62.296 178.852 71.08 174.244 78.952C169.636 86.728 163.3 92.824 155.236 97.24C147.268 101.656 138.292 103.864 128.308 103.864ZM128.308 94.36C136.276 94.36 143.476 92.584 149.908 89.032C156.34 85.384 161.38 80.392 165.028 74.056C168.676 67.624 170.5 60.472 170.5 52.6C170.5 44.728 168.676 37.624 165.028 31.288C161.38 24.856 156.34 19.864 149.908 16.312C143.476 12.664 136.276 10.84 128.308 10.84C120.34 10.84 113.092 12.664 106.564 16.312C100.132 19.864 95.0441 24.856 91.3001 31.288C87.6521 37.624 85.8281 44.728 85.8281 52.6C85.8281 60.472 87.6521 67.624 91.3001 74.056C95.0441 80.392 100.132 85.384 106.564 89.032C113.092 92.584 120.34 94.36 128.308 94.36Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M276.033 52.6H286.257V91.048C281.553 95.176 275.985 98.344 269.553 100.552C263.121 102.76 256.353 103.864 249.249 103.864C239.169 103.864 230.097 101.656 222.033 97.24C213.969 92.824 207.633 86.728 203.025 78.952C198.417 71.08 196.113 62.296 196.113 52.6C196.113 42.904 198.417 34.168 203.025 26.392C207.633 18.52 213.969 12.376 222.033 7.96C230.097 3.544 239.217 1.336 249.393 1.336C257.073 1.336 264.129 2.584 270.561 5.08C276.993 7.48 282.417 11.08 286.833 15.88L280.209 22.648C272.241 14.776 262.113 10.84 249.825 10.84C241.665 10.84 234.273 12.664 227.649 16.312C221.121 19.864 215.985 24.856 212.241 31.288C208.497 37.624 206.625 44.728 206.625 52.6C206.625 60.472 208.497 67.576 212.241 73.912C215.985 80.248 221.121 85.24 227.649 88.888C234.177 92.536 241.521 94.36 249.681 94.36C260.049 94.36 268.833 91.768 276.033 86.584V52.6Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M400.656 2.2V103H390.144V56.488H327.072V103H316.416V2.2H327.072V47.128H390.144V2.2H400.656Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M477.621 103.864C467.637 103.864 458.565 101.656 450.405 97.24C442.341 92.728 436.005 86.584 431.397 78.808C426.885 71.032 424.629 62.296 424.629 52.6C424.629 42.904 426.885 34.168 431.397 26.392C436.005 18.616 442.341 12.52 450.405 8.104C458.565 3.592 467.637 1.336 477.621 1.336C487.605 1.336 496.581 3.544 504.549 7.96C512.613 12.376 518.949 18.52 523.557 26.392C528.165 34.168 530.469 42.904 530.469 52.6C530.469 62.296 528.165 71.08 523.557 78.952C518.949 86.728 512.613 92.824 504.549 97.24C496.581 101.656 487.605 103.864 477.621 103.864ZM477.621 94.36C485.589 94.36 492.789 92.584 499.221 89.032C505.653 85.384 510.693 80.392 514.341 74.056C517.989 67.624 519.813 60.472 519.813 52.6C519.813 44.728 517.989 37.624 514.341 31.288C510.693 24.856 505.653 19.864 499.221 16.312C492.789 12.664 485.589 10.84 477.621 10.84C469.653 10.84 462.405 12.664 455.877 16.312C449.445 19.864 444.357 24.856 440.613 31.288C436.965 37.624 435.141 44.728 435.141 52.6C435.141 60.472 436.965 67.624 440.613 74.056C444.357 80.392 449.445 85.384 455.877 89.032C462.405 92.584 469.653 94.36 477.621 94.36Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M623.185 103L600.146 70.6C597.554 70.888 594.865 71.032 592.081 71.032H565.01V103H554.354V2.2H592.081C604.945 2.2 615.026 5.272 622.322 11.416C629.618 17.56 633.266 26.008 633.266 36.76C633.266 44.632 631.25 51.304 627.218 56.776C623.282 62.152 617.618 66.04 610.226 68.44L634.849 103H623.185ZM591.794 61.96C601.778 61.96 609.41 59.752 614.69 55.336C619.97 50.92 622.609 44.728 622.609 36.76C622.609 28.6 619.97 22.36 614.69 18.04C609.41 13.624 601.778 11.416 591.794 11.416H565.01V61.96H591.794Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M658.416 2.2H669.072V103H658.416V2.2Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M774.589 93.784V103H691.933V95.656L758.749 11.416H692.941V2.2H772.861V9.54399L706.189 93.784H774.589Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M838.464 103.864C828.48 103.864 819.408 101.656 811.248 97.24C803.184 92.728 796.848 86.584 792.24 78.808C787.728 71.032 785.472 62.296 785.472 52.6C785.472 42.904 787.728 34.168 792.24 26.392C796.848 18.616 803.184 12.52 811.248 8.104C819.408 3.592 828.48 1.336 838.464 1.336C848.448 1.336 857.424 3.544 865.392 7.96C873.456 12.376 879.792 18.52 884.4 26.392C889.008 34.168 891.312 42.904 891.312 52.6C891.312 62.296 889.008 71.08 884.4 78.952C879.792 86.728 873.456 92.824 865.392 97.24C857.424 101.656 848.448 103.864 838.464 103.864ZM838.464 94.36C846.432 94.36 853.632 92.584 860.064 89.032C866.496 85.384 871.536 80.392 875.184 74.056C878.832 67.624 880.656 60.472 880.656 52.6C880.656 44.728 878.832 37.624 875.184 31.288C871.536 24.856 866.496 19.864 860.064 16.312C853.632 12.664 846.432 10.84 838.464 10.84C830.496 10.84 823.248 12.664 816.72 16.312C810.288 19.864 805.2 24.856 801.456 31.288C797.808 37.624 795.984 44.728 795.984 52.6C795.984 60.472 797.808 67.624 801.456 74.056C805.2 80.392 810.288 85.384 816.72 89.032C823.248 92.584 830.496 94.36 838.464 94.36Z"
          stroke="white"
          stroke-width="2"
        />
        <path
          d="M999.437 2.2V103H990.653L925.853 21.208V103H915.197V2.2H923.981L988.925 83.992V2.2H999.437Z"
          stroke="white"
          stroke-width="2"
        />
      </svg>
      {!fade || (
        <div
          style={{ marginTop: "48vh" }}
          className="fade-in center-align row container"
        >
          <p style={{ letterSpacing: "1vh" }}>tech forum for newbies</p>
          <button
            style={{ width: "10%" }}
            className="mainBtn btn waves-effect amber darken-3 z-index-5"
            onClick={() => gitHubRepo()}
          >
            <AiIcons.AiFillGithub />
          </button>

          <Modal
            actions={[
              <Button
                flat
                modal="close"
                node="button"
                waves="red"
                onClick={() => {
                  window.location.replace(
                    "https://ec.europa.eu/info/cookies_en"
                  );
                }}
              >
                learn more
              </Button>,
              <Button
                modal="close"
                node="button"
                waves="green"
                className="amber darken-3"
                onClick={() => loginWithRedirect()}
              >
                I understand & accept
              </Button>,
            ]}
            className="black-text"
            bottomSheet={false}
            fixedFooter={false}
            header="Cookie Policy"
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
              opacity: 0.5,
              outDuration: 250,
              preventScrolling: true,
              startingTop: "4%",
            }}
            trigger={
              <button
                style={{ marginLeft: "5vh", width: "10%" }}
                className="mainBtn btn waves-effect white z-index-5"
              >
                <FcIcons.FcGoogle />
              </button>
            }
          >
            <p>
              This website like many others makes use of cookies. In order to
              provide a personalised experience. Cookies are used to hold
              information regarding account. It does not contain any personaly
              information regarding the user or who the account belongs to.
            </p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
