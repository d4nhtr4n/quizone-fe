import React from "react";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import style from "./Quiz.module.scss";

const cx = classNames.bind(style);

const answerTemplate = ["A", "B", "C", "D"];

const ToolTip = ({ id, children, title }) => (
    <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
        {children}
    </OverlayTrigger>
);

const Quiz = ({
    question,
    index,
    currentIndex,
    onClick,
    onRemove,
    onDuplicate,
}) => {
    const seconds = () => {
        switch (question.timeLimit) {
            case "5":
                return "05";
            case "10":
                return "10";
            case "20":
                return "20";
            case "30":
                return "30";
            case "60":
                return "60";
            case "90":
                return "90";
            default:
                return 0;
        }
    };

    return (
        <div
            key={question.index}
            className={cx("wrapper", {
                selected: currentIndex === index,
            })}
            onClick={() => onClick({ id: question.id })}
        >
            <div className={cx("feature-group")}>
                <ToolTip title="Duplicate Quiz" id="t-3" placement="right">
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(currentIndex);
                        }}
                    >
                        <FontAwesomeIcon icon={faClone} />
                    </span>
                </ToolTip>

                <ToolTip title="Delete Quiz" id="t-3" placement="right">
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashCan} />
                    </span>
                </ToolTip>
            </div>
            <div className={cx("info-container")}>
                <div className={cx("id")}>
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <span>{index + 1}</span>
                        <p>Quiz</p>
                    </div>
                    <span className={cx("time")}>{`${seconds()}s`}</span>
                </div>
                <div className={cx("mini-frame")}>
                    <h6>{question.question}</h6>
                    <div className={cx("middle")}>
                        {question.imageUri?.imgSrc ? (
                            <img
                                src={question.imageUri?.imgSrc}
                                className={cx("image")}
                                alt="Quest Thumbnail"
                            />
                        ) : (
                            <span className={cx("image")}></span>
                        )}
                    </div>
                    <div className={cx("answers")}>
                        <Container>
                            {question.type === "quiz" ? (
                                <Row style={{ height: "40px" }}>
                                    {Array.from(
                                        { length: 4 },
                                        (_, index) => index + 1
                                    ).map((_, index) => (
                                        <Col
                                            style={{
                                                paddingRight: 4,
                                                paddingLeft: 0,
                                            }}
                                            // className={cx("col")}
                                            xs={6}
                                            key={index}
                                        >
                                            <div className={cx("answer")}>
                                                {question.answer ===
                                                    answerTemplate[index] && (
                                                    <span
                                                        className={cx(
                                                            "correct"
                                                        )}
                                                    ></span>
                                                )}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <Row style={{ height: "40px" }}>
                                    {Array.from(
                                        { length: 2 },
                                        (_, index) => index + 1
                                    ).map((_, index) => (
                                        <Col xs={6} key={index}>
                                            <div
                                                className={cx("answer")}
                                                style={{
                                                    paddingTop: "5px",
                                                    height: "15px",
                                                }}
                                            >
                                                {question.answer ===
                                                    answerTemplate[index] && (
                                                    <span
                                                        className={cx(
                                                            "correct"
                                                        )}
                                                    ></span>
                                                )}
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
