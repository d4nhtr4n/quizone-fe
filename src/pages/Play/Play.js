import classNames from "classnames/bind";
import style from "./Play.module.scss";
import Answear from "~/components/Answear/Answear";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "~/components/Image/Image";
import images from "~/components/assets/images";
import { Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import apiConfig from "~/api/usersApi/apiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "~/components/Button/Button";
import routes from "~/configs/routes";
const host = apiConfig.socketUrl;

const cx = classNames.bind(style);
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const socketIo = io(host, {
    transports: ["websocket"],
});
export default function Play() {
    const navigate = useNavigate();
    let { pinCode, name } = useParams();
    const [myAnswer, setMyAnswer] = useState();
    const [waitNext, setWaitNext] = useState(false);
    const [showMyResult, setShowMyResult] = useState(false);
    const [myResult, setMyResult] = useState("");
    const [currentQuestionCount, setCurrentQuestionCount] = useState(-1);
    const [started, setStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [answears, setAnswers] = useState(["A", "B", "C", "D"]);
    const [showFinal, setShowFinal] = useState(false);
    const [finalRes, setFinalRes] = useState();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Cancel the event to prevent the browser's default behavior
            event.preventDefault();

            // Prompt the user with a custom message
            event.returnValue = "Are you sure you want to leave?";
        };

        const handlePopstate = () => {
            // Trigger an alert when the user navigates back
            alert("You navigated back!");
        };

        // Add the event listeners when the component mounts
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleBeforeUnload);

        // Remove the event listeners when the component unmounts
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        function onConnect() {
            console.log("Connected");
        }

        function onDisconnect() {
            console.log("Disconnected");
        }

        socketIo.on("kick_player_res", async function (data) {
            if (data) {
                if (data.pin === pinCode && data.name === name) {
                    navigate(routes.join, {
                        replace: true,
                    });
                }
                console.log(data);
            }
        });

        socketIo.on("game_alive", function (data) {
            if (data === false) {
                navigate("/join", {
                    replace: true,
                });
            }
        });

        socketIo.on("host_disconnect", function (data) {
            if (data === pinCode) {
                navigate("/join", {
                    replace: true,
                });
            }
            console.log("host_disconnect", data, pinCode);
        });

        socketIo.on("next_question_res_player", function (data) {
            if (data.pin === pinCode) {
                console.log("new question", data);
                setShowOptions(false);
                setMyAnswer("");
                setCurrentQuestionCount(data.counter);
                setTimeout(() => {
                    setShowOptions(true);
                    setWaitNext(false);
                }, data.time_prepare * 1000);
                setWaitNext(true);
                setShowMyResult(false);
                setMyResult();
                if (data.type === "truefalse") {
                    setAnswers(["A", "B"]);
                } else {
                    setAnswers(["A", "B", "C", "D"]);
                }
            }
            console.log(data);
        });

        socketIo.on("send_answer_res", function (data) {
            console.log("send_answer_res", data);
            if (data) {
                setMyResult(data);
            }
        });

        socketIo.on("result_res_player", function (data) {
            console.log("result_res_player", data);
            if (data) {
                setShowMyResult(true);
            } else {
                if (!myResult) {
                    console("fake");
                    setMyResult({
                        result: false,
                        point: 0,
                    });
                }
            }
        });

        socketIo.on("host_start", function (data) {
            if (data.pin === pinCode) {
                setStarted(true);
            }
        });

        socketIo.on("final_result_res_player", function (data) {
            if (data.pin === pinCode) {
                setShowFinal(true);
                setWaitNext(false);
                setShowOptions(false);
                setShowMyResult(false);
                console.log(data);
                if (data.result && data.result.length > 0) {
                    const temp = data.result.filter((obj) => {
                        return obj.name === name;
                    });
                    if (temp && temp.length > 0) {
                        setFinalRes(temp[0].point);
                    } else setFinalRes(0);
                }
            }
        });

        socketIo.on("connect", onConnect);
        socketIo.on("disconnect", onDisconnect);
    }, [pinCode, socketIo]);

    return (
        <div className={cx("wrapper")}>
            {!started && (
                <div className={cx("background")}>
                    <div class={cx("stripe_inner")}>WAITING</div>
                </div>
            )}
            {started && showOptions && (
                <div className={cx("answears")}>
                    <Container>
                        <Row style={{ height: "calc(100vh - 36px)" }}>
                            {answears.map((option, index) => (
                                <Col xs={6}>
                                    <Answear
                                        disable={
                                            myAnswer && myAnswer !== option
                                        }
                                        client={true}
                                        key={index}
                                        selected={myAnswer === option}
                                        value={option}
                                        index={index}
                                        onClick={() => {
                                            setMyAnswer(option);
                                            setWaitNext(true);
                                            console.log(currentQuestionCount);
                                            socketIo.emit("send_answer_req", {
                                                answer: option,
                                                pin: pinCode,
                                                name: name,
                                                counter: currentQuestionCount,
                                            });
                                            socketIo.emit(
                                                "game_alive",
                                                pinCode
                                            );
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>
            )}
            {waitNext && (
                <div
                    className={cx("modal-container", {
                        active: true,
                    })}
                >
                    {showMyResult ? (
                        <div className={cx("modal-background")}>
                            <div className={cx("modal")}>
                                <div className={cx("result")}>
                                    <Image
                                        className={cx("result-image")}
                                        src={
                                            myResult.result
                                                ? images.correct
                                                : images.incorrect
                                        }
                                    />
                                    <h1 className={cx("result-status")}>
                                        {myResult.result
                                            ? "Correct"
                                            : "Incorrect"}
                                    </h1>
                                    <h1
                                        className={cx("result-point")}
                                    >{`+${myResult.point}`}</h1>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={cx("modal-background")}>
                            <div className={cx("modal")}>
                                <div>
                                    <div className={cx("loader")}>
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {showFinal && (
                <div
                    className={cx("modal-container", {
                        active: showFinal,
                    })}
                >
                    <div className={cx("modal-background")}>
                        <div className={cx("area")}>
                            <div className={cx("navigate-logo")}>
                                <Link to={routes.home}>
                                    <Image src={images.logo} />
                                </Link>
                            </div>
                            <div className={cx("close-btn")}>
                                <Link to={routes.join}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </Link>
                            </div>
                            <ul className={cx("circles")}>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div className={cx("modal")}>
                            <div className={cx("congrats")}>
                                <h1>Congratulations!</h1>
                                <p>{`Your score is ${finalRes}`}</p>
                                <p>{`Please check the leaderboard on the host's screen.`}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
