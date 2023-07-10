import {
    faCheck,
    faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import usersApi from "~/api/usersApi";

import Button from "~/components/Button";
import Image from "~/components/Image";

import style from "../Authentication.module.scss";
import images from "~/components/assets/images";
import usersApi from "~/api/usersApi/usersApi";
import routes from "~/configs/routes";

const cx = classNames.bind(style);

function Login() {
    const navigate = useNavigate();
    const [loginFailed, setLoginFailed] = useState(false);

    function validateEmail(value) {
        let error;
        if (!value) {
            error = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = "Invalid email address";
        }
        return error;
    }

    return (
        <div className={cx("wrapper", "login")}>
            <div className={cx("welcome")}>
                <Image
                    className={cx("logo")}
                    src={images.logoWithText}
                    onClick={() => {
                        navigate(routes.home);
                    }}
                />
                <div className={cx("content")}>
                    <div>
                        <Image className={cx("robot")} src={images.robot} />
                    </div>
                    <h1>Welcome Back!</h1>
                    <p>
                        To keep connected with us please sign in with your
                        personal info.
                    </p>
                </div>
            </div>
            <div className={cx("control")}>
                <h1 className={cx("heading")}>Sign In</h1>
                <p
                    className={cx("login-failed", {
                        visible: loginFailed,
                    })}
                >
                    Incorrect email or password. Please try again!
                </p>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    onSubmit={(values) => {
                        (async function handleLogin() {
                            try {
                                const response = await usersApi.login(
                                    values.email,
                                    values.password
                                );
                                let result = response;
                                if (result.status === "success") {
                                    document.cookie =
                                        "access_token=" + result.data.cookie;
                                    navigate("/", {
                                        replace: true,
                                    });
                                } else {
                                    setLoginFailed(true);
                                    console.log(result.error);
                                }
                            } catch (error) {
                                setLoginFailed(true);
                                console.log(error);
                            }
                        })();
                    }}
                >
                    {({ errors, touched, validateForm }) => (
                        <Form className={cx("form")}>
                            <div className={cx("field")}>
                                <div className={cx("input-wrapper")}>
                                    <Field
                                        name="email"
                                        validate={validateEmail}
                                        required
                                    />
                                    <p>Email</p>
                                    <span
                                        className={cx({
                                            error:
                                                errors.email && touched.email,
                                        })}
                                    />
                                </div>
                                <div
                                    className={cx("notify", {
                                        visible: errors.email && touched.email,
                                    })}
                                >
                                    <FontAwesomeIcon
                                        className={cx("icon")}
                                        icon={faCircleExclamation}
                                    />
                                    {errors.email || "Placehoder"}
                                </div>
                            </div>

                            <div className={cx("input-wrapper")}>
                                <Field
                                    name="password"
                                    type="password"
                                    required
                                />
                                <p>Password</p>
                                <span />
                            </div>
                            <div className={cx("help")}>
                                <label className={cx("checkbox-wrapper")}>
                                    <Field
                                        type="checkbox"
                                        name="save-password"
                                    />
                                    <div className={cx("checkbox")}>
                                        <span className={cx("checkmark")}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </div>

                                    <div className={cx("label")}>
                                        Remember me
                                    </div>
                                </label>
                                <Link
                                    className={cx("forgot-password")}
                                    to="/forgotpassword"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Button
                                className={cx("submit-button")}
                                primary
                                type="submit"
                                onClick={() => validateForm()}
                            >
                                Sign In
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div className={cx("switch")}>
                    New to QuiZone?
                    <Link className={cx("link")} to="/register">
                        Register now
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}

export default Login;
