import classNames from "classnames/bind";
import style from "./MyQuizz.module.scss";
import { Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import Button from "~/components/Button/Button";
import "./MyQuizz.scss";
import { end } from "@popperjs/core";
import { useEffect, useState } from "react";
import { useCookie } from "~/hooks";
import usersApi from "~/api/usersApi/usersApi";
import { userConst } from "~/api/constant";
const cx = classNames.bind(style);
const temp = ["a", "a", "a", "a", "a", "a", "a", "a", "a"];
var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};
export default function MyQuizz() {
    const [quizzList, setQuizzList] = useState();
    const accessToken = useCookie("access_token");
    useEffect(() => {
        (async function handleGetList() {
            try {
                const response = await usersApi.getQuizzList(accessToken);
                let result = response;
                console.log("Quizz List", result);
                if (result.status === "success") {
                    console.log(response.data);
                    setQuizzList(response.data.quizzes);
                } else {
                    if (result.error === userConst.authenticationFailed) {
                        delete_cookie("access_token");
                    }
                }
            } catch (error) {}
        })();
    }, [accessToken]);
    return (
        <div className={cx("wrapper")} id="quizz-list">
            <Container>
                <Row>
                    {quizzList &&
                        quizzList.map((item, index) => (
                            <Col md={6} lg={4} xxl={3} key={index}>
                                <Card
                                    className={cx("card")}
                                    bg="dark"
                                    text="light"
                                >
                                    <Card.Img
                                        variant="top"
                                        src="https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_1280.jpg"
                                        className={cx("card-img")}
                                    />
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            {item.description
                                                ? item.description
                                                : item.name}
                                        </Card.Text>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
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

                                                <Dropdown.Menu align={end}>
                                                    <Dropdown.Item href="#/action-1">
                                                        Edit
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#/action-2">
                                                        Share
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item href="#/action-3">
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>
            </Container>
        </div>
    );
}
