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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { faCircleXmark, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.defaults.font.family = "'FontAwesome',san-sefif'";

const chartColors = ["#E21B3C", "#D89E00", "#26890C", "#1368CE"];
const timerColors = ["#1368CE", "#26890C", "#D89E00", "#E21B3C"];

const chartOptions = {
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                display: false,
            },
        },
    },

    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
};

const host = apiConfig.socketUrl;
const answerTemplate = ["A", "B", "C", "D"];
const cx = classNames.bind(style);
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
        return <div className={cx("timer")}>Too lale...</div>;
    }

    return (
        <div className={cx("timer")}>
            <div className={cx("text")}>Remaining</div>
            <div className={cx("value")}>{remainingTime}</div>
            <div className={cx("text")}>seconds</div>
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
    const [chartData, setChartData] = useState();
    const [currentQuestion, setCurrentQuestion] = useState();
    const [showResult, setShowResult] = useState(false);
    const [waitRoom, setWaitRoom] = useState(true);
    const [pinCode, setPinCode] = useState();
    const [preTime, setPretime] = useState(-1);
    const [currentQuestionCount, setCurrentQuestionCount] = useState(0);
    const [waitTime, setWaitTime] = useState(-1);
    const [showOptions, setShowOptions] = useState(false);
    const [trueIndex, setTrueIndex] = useState(-1);
    const [showFinal, setShowFinal] = useState(false);
    const [finalResults, setFinalResults] = useState([]);

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
        if (showFinal) {
            socketIo.emit("final_result_req", { pin: pinCode });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFinal]);

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
            if (data !== "End") {
                setCurrentQuestion(data.question);
                setTrueIndex(answerTemplate.indexOf(data.question.answer));
                setPretime(data.question.time_prepare);
            } else {
                setShowFinal(true);
            }
        });
        socketIo.on("result_res", function (data) {
            if (data) {
                console.log(data);
                if (data.pin === pinCode) {
                    setChartData({
                        labels: ["", "", "", ""],
                        datasets: [
                            {
                                data: [
                                    data.counterA,
                                    data.counterB,
                                    data.counterC,
                                    data.counterD,
                                ],
                                borderRadius: 1,
                                backgroundColor: chartColors.map(
                                    (color, index) =>
                                        index ===
                                        answerTemplate.indexOf(data.answer)
                                            ? color
                                            : `${color}59`
                                ),
                            },
                        ],
                    });
                }
                console.log(data);
            }
        });
        socketIo.on("final_result_res", (data) => {
            if (data) {
                console.log(data.result);
                setFinalResults(data.result);
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
                                        colors={timerColors}
                                        colorsTime={[10, 6, 3, 0]}
                                        onComplete={() => {
                                            setWaitTime(-1);
                                            setShowResult(true);
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
                        <Col lg={6}>
                            {!showResult ? (
                                <Image src={currentQuestion.image_uri} />
                            ) : (
                                <div>
                                    {chartData && (
                                        <Bar
                                            options={chartOptions}
                                            data={chartData}
                                        />
                                    )}
                                </div>
                            )}
                        </Col>

                        {showResult && (
                            <div className={cx("next-button")}>
                                <Col>
                                    <Button
                                        primary
                                        onClick={() => {
                                            socketIo.emit("next_question_req", {
                                                counter:
                                                    currentQuestionCount + 1,
                                                pin: pinCode,
                                            });
                                            setCurrentQuestionCount(
                                                currentQuestionCount + 1
                                            );
                                            setShowResult(false);
                                            setShowOptions(false);
                                            setChartData("");
                                        }}
                                    >
                                        Next
                                    </Button>
                                </Col>
                            </div>
                        )}
                    </Row>
                </Container>
            )}
            {preTime >= 0 && (
                <div className={cx("timer-wrapper")}>
                    <CountdownCircleTimer
                        isPlaying
                        duration={preTime}
                        colors={["#00ffff", "#00ffff", "#b100da", "#b100da"]}
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
            {((showOptions && waitTime >= 0) || showResult) && (
                <div className={cx("answears")}>
                    <Container>
                        <Row>
                            {[
                                currentQuestion.answerA,
                                currentQuestion.answerB,
                                currentQuestion.answerC,
                                currentQuestion.answerD,
                            ].map((option, index, array) => (
                                <Col lg={6} key={index}>
                                    <Answear
                                        disable={
                                            showResult &&
                                            index !==
                                                answerTemplate.indexOf(
                                                    currentQuestion.answer
                                                )
                                        }
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
            {showFinal && (
                <div
                    className={cx("modal-container", {
                        active: showFinal,
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
                            <Button
                                className={cx("close-btn")}
                                rightIcon={
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                }
                                to={"/"}
                            />
                            <div className={cx("congrats")}>
                                <h1>Congratulations!</h1>
                            </div>
                            {finalResults && (
                                <div className={cx("podium-list")}>
                                    <div className={cx("podium", "podium-2nd")}>
                                        <Image src={images.podium2nd}></Image>
                                        {finalResults[1] && (
                                            <span>{finalResults[1].name}</span>
                                        )}
                                    </div>
                                    <div className={cx("podium", "podium-1st")}>
                                        <Image src={images.podium1st}></Image>
                                        {finalResults[0] && (
                                            <span>{finalResults[0].name}</span>
                                        )}
                                    </div>
                                    <div className={cx("podium", "podium-3rd")}>
                                        <Image src={images.podium3rd}></Image>
                                        {finalResults[2] && (
                                            <span>{finalResults[2].name}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
