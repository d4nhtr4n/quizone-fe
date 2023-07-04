import classNames from "classnames/bind";
import style from "./MyQuizz.module.scss";
import { Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import Button from "~/components/Button/Button";
import "./MyQuizz.scss";
import { end } from "@popperjs/core";
import { Fragment, useEffect, useState } from "react";
import { useCookie } from "~/hooks";
import usersApi from "~/api/usersApi/usersApi";
import { userConst } from "~/api/constant";
import { toast } from "react-hot-toast";
import FallBack from "~/components/FallBack/FallBack";
import images from "~/components/assets/images";
import routes from "~/configs/routes";
import {
    MDBModal,
    MDBModalBody,
    MDBModalContent,
    MDBModalDialog,
    MDBModalFooter,
    MDBModalHeader,
    MDBModalTitle,
    MDBSwitch,
} from "mdb-react-ui-kit";
import Answear from "~/components/Answear/Answear";
import Image from "~/components/Image/Image";
import { Form, useNavigate } from "react-router-dom";
const cx = classNames.bind(style);
const temp = ["a", "a", "a", "a", "a", "a", "a", "a", "a"];
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
const anwerTemplate = ["A", "B", "C", "D"];
export default function MyQuizz() {
    const [quizzList, setQuizzList] = useState();
    const accessToken = useCookie("access_token");
    const [loggedIn, setLoggedIn] = useState(true);
    const [quizModal, setQuizModal] = useState(false);
    const [quizInfo, setQuizInfo] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async function handleGetList() {
            try {
                const response = await usersApi.getQuizzList(accessToken);
                let result = response;
                console.log("Quizz List", result);
                if (result.status === "success") {
                    console.log(response.data);
                    setQuizzList(response.data.quizzes);
                    setLoggedIn(true);
                } else {
                    if (
                        result.error === userConst.authenticationFailed ||
                        result.error === "Not Login"
                    ) {
                        delete_cookie("access_token");
                        setLoggedIn(false);
                    }
                }
            } catch (error) {}
        })();
    }, [accessToken]);
    return (
        <div className={cx("wrapper")} id="quizz-list">
            {loggedIn ? (
                <Fragment>
                    <Container>
                        {quizzList && quizzList.length > 0 && (
                            <Row
                                style={{
                                    justifyContent: "center",
                                    marginBottom: 16,
                                }}
                            >
                                <Button primary to={"/create"}>
                                    New Quiz
                                </Button>
                            </Row>
                        )}
                        <Row>
                            {quizzList && quizzList.length > 0 ? (
                                quizzList.map((item, index) => (
                                    <Col md={6} lg={4} xxl={3} key={index}>
                                        <Card
                                            className={cx("card")}
                                            bg="dark"
                                            text="light"
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={
                                                    item.thumbnail_uri ||
                                                    images.defaultThumbnail
                                                }
                                                className={cx("card-img")}
                                            />
                                            <Card.Body>
                                                <Card.Title
                                                    className={cx("title")}
                                                >
                                                    {item.name}
                                                </Card.Title>
                                                <Card.Text
                                                    className={cx("text")}
                                                >
                                                    {item.description
                                                        ? item.description
                                                        : item.name}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <div
                                                    style={{
                                                        justifySelf: "flex-end",
                                                        display: "flex",

                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <Button
                                                        primary
                                                        to={`/host/${item._id}`}
                                                    >
                                                        Host
                                                    </Button>

                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="success"
                                                            id="dropdown-basic"
                                                        >
                                                            Options
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu
                                                            align={end}
                                                        >
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    (async function handleGetQuiz() {
                                                                        try {
                                                                            const response =
                                                                                await usersApi.getQuizInfo(
                                                                                    accessToken,
                                                                                    item._id
                                                                                );
                                                                            let result =
                                                                                response;
                                                                            console.log(
                                                                                "Get Quiz",
                                                                                result
                                                                            );
                                                                            if (
                                                                                result.status ===
                                                                                "success"
                                                                            ) {
                                                                                console.log(
                                                                                    response.data
                                                                                );

                                                                                setQuizInfo(
                                                                                    response.data
                                                                                );
                                                                                setQuizModal(
                                                                                    true
                                                                                );
                                                                            } else {
                                                                                if (
                                                                                    result.error ===
                                                                                    userConst.authenticationFailed
                                                                                ) {
                                                                                    delete_cookie(
                                                                                        "access_token"
                                                                                    );
                                                                                }
                                                                            }
                                                                        } catch (error) {}
                                                                    })();
                                                                }}
                                                            >
                                                                Details
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    navigate(
                                                                        `/edit/${item._id}`
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item
                                                                onClick={() => {
                                                                    (async function handleDeleteQuiz() {
                                                                        try {
                                                                            const response =
                                                                                await usersApi.deleteQuiz(
                                                                                    accessToken,
                                                                                    item._id
                                                                                );
                                                                            let result =
                                                                                response;
                                                                            console.log(
                                                                                "Delete",
                                                                                result
                                                                            );
                                                                            if (
                                                                                result.status ===
                                                                                "success"
                                                                            ) {
                                                                                console.log(
                                                                                    response.data
                                                                                );
                                                                                toast.success(
                                                                                    "Delete Successfully"
                                                                                );
                                                                                setQuizzList(
                                                                                    response
                                                                                        .data
                                                                                        .quizzes
                                                                                );
                                                                            } else {
                                                                                if (
                                                                                    result.error ===
                                                                                    userConst.authenticationFailed
                                                                                ) {
                                                                                    delete_cookie(
                                                                                        "access_token"
                                                                                    );
                                                                                }
                                                                            }
                                                                        } catch (error) {}
                                                                    })();
                                                                }}
                                                            >
                                                                Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <FallBack
                                    data={{
                                        image: images.noData,
                                        title: `Quizzes Not Found`,
                                        detail: "Your untapped potential lies in creating quizzes. Unlock it by sharing your knowledge and igniting curiosity. Start now and let your quiz be the gateway to new learning adventures.",
                                        buttons: [
                                            <Button to={routes.create} primary>
                                                Create New Quiz
                                            </Button>,
                                        ],
                                    }}
                                />
                            )}
                        </Row>
                    </Container>
                </Fragment>
            ) : (
                <FallBack
                    data={{
                        image: images.ghosts,
                        title: `Please Log In to Access Features`,
                        detail: "To access all features and services on this platform, kindly log in to your account. Without logging in, certain features may be restricted or unavailable. Logging in offers a personalized experience, exclusive features, saved progress, seamless interaction, and enhanced security.",
                        buttons: [
                            <Button to={routes.register} primary>
                                Create New Account
                            </Button>,
                            <Button to={routes.login} outline>
                                Login Now
                            </Button>,
                        ],
                    }}
                ></FallBack>
            )}
            {quizInfo && (
                <MDBModal show={quizModal} tabIndex="-1" setShow={setQuizModal}>
                    <MDBModalDialog centered size="lg">
                        <MDBModalContent className={cx("modal-content")}>
                            <MDBModalHeader>
                                <MDBModalTitle className={cx("modal-title")}>
                                    <div>
                                        <h3> {quizInfo.quiz.name}</h3>
                                        <p>{quizInfo.quiz.description}</p>
                                    </div>
                                </MDBModalTitle>
                            </MDBModalHeader>
                            <MDBModalBody className={cx("modal-body")}>
                                {quizInfo.questions.length > 0 && (
                                    <div>
                                        {quizInfo.questions.map(
                                            (item, index) => {
                                                let answers = [
                                                    item.answerA,
                                                    item.answerB,
                                                    item.answerC,
                                                    item.answerD,
                                                ];
                                                return (
                                                    <div>
                                                        <div>
                                                            <h4>
                                                                {`${
                                                                    index + 1
                                                                }. ${
                                                                    item.question
                                                                }`}
                                                            </h4>
                                                            <div
                                                                className={cx(
                                                                    "question-info"
                                                                )}
                                                            >
                                                                <p>
                                                                    {`Prepare
                                                                            Time: ${item.time_prepare}s`}
                                                                </p>
                                                                <p>
                                                                    {`Answer Time
                                                                            : ${item.time_waiting}s`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Container>
                                                            <Row>
                                                                <Col>
                                                                    {answers.map(
                                                                        (
                                                                            answer,
                                                                            index
                                                                        ) =>
                                                                            answer && (
                                                                                <Row>
                                                                                    <Col>
                                                                                        <Answear
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            style={{
                                                                                                paddingBottom: 6,
                                                                                            }}
                                                                                            value={
                                                                                                answer
                                                                                            }
                                                                                            index={
                                                                                                index
                                                                                            }
                                                                                            disable={
                                                                                                index !==
                                                                                                anwerTemplate.indexOf(
                                                                                                    item.answer
                                                                                                )
                                                                                            }
                                                                                            onClick={() => {}}
                                                                                        />
                                                                                    </Col>
                                                                                </Row>
                                                                            )
                                                                    )}
                                                                </Col>
                                                                {item.image_uri && (
                                                                    <Col>
                                                                        <Image
                                                                            className={cx(
                                                                                "question-image"
                                                                            )}
                                                                            src={
                                                                                item.image_uri
                                                                            }
                                                                        />
                                                                    </Col>
                                                                )}
                                                            </Row>
                                                        </Container>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </MDBModalBody>
                            <MDBModalFooter className={cx("modal-footer")}>
                                <Button
                                    outline
                                    to={`/edit/${quizInfo.quiz._id}`}
                                >
                                    Edit
                                </Button>
                                <Button
                                    primary
                                    to={`/host/${quizInfo.quiz._id}`}
                                >
                                    Host
                                </Button>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            )}
        </div>
    );
}
