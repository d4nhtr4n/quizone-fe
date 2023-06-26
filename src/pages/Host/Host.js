import classNames from "classnames/bind";
import style from "./Host.module.scss";
import Answear from "~/components/Answear/Answear";
import { Fragment, useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "~/components/Image/Image";
import images from "~/components/assets/images";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import apiConfig from "~/api/usersApi/apiConfig";
import { useCookie } from "~/hooks";
import usersApi from "~/api/usersApi/usersApi";
import { userConst } from "~/api/constant";
import Button from "~/components/Button/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const host = apiConfig.socketUrl;

const cx = classNames.bind(style);
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className="timer">Too lale...</div>;
    }

    return (
        <div className="timer">
            <div className="text">Remaining</div>
            <div className="value">{remainingTime}</div>
            <div className="text">seconds</div>
        </div>
    );
};
const socketIo = io(host, {
    transports: ["websocket"],
});
export default function Host() {
    const [players, setPlayers] = useState([]);
    const accessToken = useCookie("access_token");
    let { id } = useParams();

    const [currentQuestion, setCurrentQuestion] = useState();
    const [waitRoom, setWaitRoom] = useState(true);
    const [pinCode, setPinCode] = useState();
    const [preTime, setPretime] = useState(-1);
    const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
    const [waitTime, setWaitTime] = useState(-1);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        (async function handleGetList() {
            try {
                const response = await usersApi.getPin(accessToken, id);
                let result = response;
                console.log(result);
                if (result.status === "success") {
                    setPinCode(response.data.pin);
                } else {
                    if (result.error === userConst.authenticationFailed) {
                        delete_cookie("access_token");
                    }
                }
            } catch (error) {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        function onConnect() {
            console.log("Connected");
        }

        function onDisconnect() {
            console.log("Disconnected");
        }

        socketIo.emit("host_info_update", { pin: pinCode });
        socketIo.on("player_join_host", function (data) {
            setPlayers(data.name);
        });
        socketIo.on("next_question_res", function (data) {
            console.log(data);
            setCurrentQuestion(data.question);
            setPretime(data.question.time_prepare);
        });
        socketIo.on("result_res", function (data) {
            if (data) {
                if (data.pin === pinCode) {
                }
                console.log(data);
            }
        });

        socketIo.on("connect", onConnect);
        socketIo.on("disconnect", onDisconnect);
    }, [pinCode, socketIo]);
    useEffect(() => {
        socketIo.emit("host_info_update", { pin: pinCode });
    });
    return (
        <div className={cx("wrapper")}>
            {waitRoom && pinCode && (
                <div className={cx("background")}>
                    <div class={cx("stripe")}>
                        <div class={cx("stripe_inner")}>WAITING</div>
                    </div>
                </div>
            )}
            {waitRoom && pinCode && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                    }}
                >
                    <div className={cx("wait-room")}>
                        <div className={cx("pin-code")}>
                            PIN:&nbsp;
                            <span>{pinCode}</span>
                        </div>
                        {players.length > 0 && (
                            <Fragment>
                                <Button
                                    primary
                                    onClick={() => {
                                        setWaitRoom(false);
                                        socketIo.emit("next_question_req", {
                                            counter: currentQuestionCount,
                                            pin: pinCode,
                                        });
                                        socketIo.emit("host_start", {
                                            pin: pinCode,
                                        });
                                    }}
                                >
                                    Start
                                </Button>
                                <div className={cx("line")}> </div>
                            </Fragment>
                        )}

                        <div className={cx("players")}>
                            {players.slice(-30).map((player, index) => {
                                return (
                                    <div key={index} className={cx("player")}>
                                        {player}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {!waitRoom && currentQuestion && (
                <Container className={cx("question-wrapper")}>
                    <div className={cx("question-number")}>
                        <span>{currentQuestionCount + 1}</span>
                    </div>
                    <div className={cx("question-content")}>
                        <p>{currentQuestion.question}</p>
                    </div>
                    <Row className={cx("images")}>
                        {waitTime >= 0 && (
                            <div className={cx("wait-timmer")}>
                                <div className="timer-wrapper">
                                    <CountdownCircleTimer
                                        isPlaying
                                        duration={waitTime}
                                        colors={[
                                            "#004777",
                                            "#F7B801",
                                            "#A30000",
                                            "#A30000",
                                        ]}
                                        colorsTime={[10, 6, 3, 0]}
                                        onComplete={() => {
                                            setWaitTime(-1);
                                            socketIo.emit("result_req", {
                                                pin: pinCode,
                                                counter: currentQuestionCount,
                                            });
                                        }}
                                    >
                                        {renderTime}
                                    </CountdownCircleTimer>
                                </div>
                            </div>
                        )}
                        <Col lg={5}>
                            <Image src="https://c4.wallpaperflare.com/wallpaper/88/769/281/1920x1080-px-digital-art-japan-minimalism-simple-background-sun-trees-video-games-star-wars-hd-art-wallpaper-preview.jpg" />
                        </Col>
                    </Row>
                </Container>
            )}
            {preTime >= 0 && (
                <div className={cx("timer-wrapper")}>
                    <CountdownCircleTimer
                        isPlaying
                        duration={preTime}
                        colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                        colorsTime={[10, 6, 3, 0]}
                        onComplete={() => {
                            setPretime(-1);
                            setShowOptions(true);
                            setWaitTime(currentQuestion.time_waiting);
                        }}
                    >
                        {renderTime}
                    </CountdownCircleTimer>
                </div>
            )}
            {showOptions && waitTime >= 0 && (
                <div className={cx("answears")}>
                    <Container>
                        <Row>
                            {[
                                currentQuestion.answerA,
                                currentQuestion.answerB,
                                currentQuestion.answerC,
                                currentQuestion.answerD,
                            ].map((option, index) => (
                                <Col lg={6} key={index}>
                                    <Answear
                                        key={index}
                                        value={option}
                                        index={index}
                                        onClick={() => {}}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>
            )}

            {/* <Container>
                
                
            </Container> */}
            {/* 
            <div
                className={cx("modal-container", {
                    active: showResult,
                })}
            >
                <div className={cx("modal-background")}>
                    <div className={cx("area")}>
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
                        <p>Correct</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
