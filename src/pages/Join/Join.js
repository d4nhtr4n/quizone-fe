import classNames from "classnames/bind";
import style from "./Join.module.scss";
import Button from "~/components/Button/Button";
import { Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { io } from "socket.io-client";
import apiConfig from "~/api/usersApi/apiConfig";
import { useState } from "react";
import { toast } from "react-hot-toast";
const host = apiConfig.baseUrl;
const cx = classNames.bind(style);
export default function Join() {
    const [text, setText] = useState("JOIN GAME");
    const navigate = useNavigate();
    const socketIo = io(host);

    useEffect(() => {
        function onConnect() {
            console.log("Connected");
        }

        function onDisconnect() {
            console.log("Disconnected");
        }

        socketIo.on("player_join_res", function (data) {
            if (data.error) {
                console.log(data.error);
                toast.error(data.error);
            } else {
                console.log(data);
                navigate(`/play/${data.pin}/${data.name}`, {
                    replace: true,
                });
            }
        });

        socketIo.on("connect", onConnect);
        socketIo.on("disconnect", onDisconnect);
        // socketIo.on('foo', onFooEvent);
    }, [socketIo]);
    return (
        <div className={cx("container")}>
            <div className={cx("background")}>
                <div class={cx("stripe")}>
                    <div class={cx("stripe_inner")}>{text}</div>
                </div>
            </div>
            <div className={cx("join-form")}>
                {/* <div className={cx("logo-wrapper")}>
                    <Image className={cx("logo")} src={images.logo} />
                </div> */}
                <Formik
                    initialValues={{
                        pinCode: "",
                    }}
                    onSubmit={(values) => {
                        (async function handleJoinGame() {
                            try {
                                socketIo.emit("player_join_req", {
                                    pin: values.pinCode,
                                    name: values.name,
                                });
                            } catch (error) {}
                        })();
                    }}
                >
                    {({ validateForm }) => (
                        <Form className={cx("form")}>
                            <div className={cx("input-wrapper")}>
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Your Nickname"
                                    required
                                />
                                <Field
                                    name="pinCode"
                                    type="text"
                                    placeholder="Game PIN"
                                    required
                                />
                            </div>

                            <Button
                                className={cx("submit-button")}
                                primary
                                type="submit"
                                onClick={() => validateForm()}
                            >
                                Enter
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
