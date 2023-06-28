import classNames from "classnames/bind";
import style from "./Play.module.scss";
import Answear from "~/components/Answear/Answear";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Image from "~/components/Image/Image";
import images from "~/components/assets/images";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import apiConfig from "~/api/usersApi/apiConfig";
const host = apiConfig.socketUrl;

const cx = classNames.bind(style);
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
const answears = ["A", "B", "C", "D"];
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
    useEffect(() => {
        function onConnect() {
            console.log("Connected");
        }

        function onDisconnect() {
            console.log("Disconnected");
        }

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
            console.log("host_disconnect", data);
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
                                            myResult
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
        </div>
    );
}
