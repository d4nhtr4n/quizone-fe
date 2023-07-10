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

import images from "~/components/assets/images";
import Button from "~/components/Button";
import Image from "~/components/Image";

import style from "../Authentication.module.scss";
import usersApi from "~/api/usersApi/usersApi";
import routes from "~/configs/routes";

const cx = classNames.bind(style);

function Register() {
    const navigate = useNavigate();
    const [registerFailed, setRegisterFailed] = useState(false);

    function validateName(value) {
        let error;
        if (!value) {
            error = "Required";
        }
        return error;
    }

    function validateEmail(value) {
        let error;
        if (!value) {
            error = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = "Invalid email address";
        }
        return error;
    }

    function validatePassword(value) {
        let error;
        if (!value) {
            error = "Required";
        } else if (value.length < 7) {
            error = "Password too short (7-16 chars)";
        } else if (value.length > 16) {
            error = "Password too long (7-16 chars)";
        }
        return error;
    }

    function validateConfirmPassword(value, password) {
        let error;
        if (!value) {
            error = "Required";
        } else if (value !== password) {
            error = "Password does not match";
        }
        return error;
    }

    function validateAgreement(value) {
        let error;
        if (!value) error = "You have to agree to our Terms & Conditions";
        return error;
    }

    return (
        <div className={cx("wrapper", "register")}>
            <div className={cx("welcome")}>
                <Image
                    className={cx("logo")}
                    src={images.logoWithText}
                    onClick={() => navigate(routes.home)}
                />
                <div className={cx("content")}>
                    <div>
                        <Image className={cx("robot")} src={images.robot} />
                    </div>
                    <h1>Welcome to QuiZone!</h1>
                    <p>
                        Join us and embark on a journey of knowledge and fun.
                        Register now to test your wits and challenge yourself
                        with our exciting quizzes. Let the adventure begin!
                    </p>
                </div>
            </div>
            <div className={cx("control")}>
                <h1 className={cx("heading")}>Sign Up</h1>
                <p
                    className={cx("register-failed", {
                        visible: !!registerFailed,
                    })}
                >
                    {registerFailed || "Placehoder"}
                </p>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        confirmPassword: "",
                        agreement: true,
                    }}
                    onSubmit={(values) => {
                        (async function handleRegister() {
                            try {
                                const response = await usersApi.register(
                                    values.email,
                                    values.password
                                );
                                let result = response;
                                if (result.status === "success") {
                                    console.log(result);
                                    document.cookie =
                                        "access_token=" + result.data.cookie;
                                    navigate("/", {
                                        replace: true,
                                    });
                                } else {
                                    console.log(result);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        })();
                    }}
                >
                    {({ values, errors, touched, validateForm }) => (
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

                            <div className={cx("field")}>
                                <div className={cx("input-wrapper")}>
                                    <Field
                                        name="password"
                                        type="password"
                                        validate={validatePassword}
                                        required
                                    />
                                    <p>Password</p>
                                    <span
                                        className={cx({
                                            error:
                                                errors.password &&
                                                touched.password,
                                        })}
                                    />
                                </div>
                                <div
                                    className={cx("notify", {
                                        visible:
                                            errors.password && touched.password,
                                    })}
                                >
                                    <FontAwesomeIcon
                                        className={cx("icon")}
                                        icon={faCircleExclamation}
                                    />
                                    {errors.password || "Placehoder"}
                                </div>
                            </div>

                            <div className={cx("field")}>
                                <div className={cx("input-wrapper")}>
                                    <Field
                                        name="confirmPassword"
                                        type="password"
                                        validate={(value) =>
                                            validateConfirmPassword(
                                                value,
                                                values.password
                                            )
                                        }
                                        required
                                    />
                                    <p>Confirm Password</p>
                                    <span
                                        className={cx({
                                            error:
                                                errors.confirmPassword &&
                                                touched.confirmPassword,
                                        })}
                                    />
                                </div>
                                <div
                                    className={cx("notify", {
                                        visible:
                                            errors.confirmPassword &&
                                            touched.confirmPassword,
                                    })}
                                >
                                    <FontAwesomeIcon
                                        className={cx("icon")}
                                        icon={faCircleExclamation}
                                    />
                                    {errors.confirmPassword || "Placehoder"}
                                </div>
                            </div>

                            <div className={cx("agreement")}>
                                <label className={cx("checkbox-wrapper")}>
                                    <Field
                                        type="checkbox"
                                        name="agreement"
                                        validate={validateAgreement}
                                    />
                                    <div className={cx("checkbox")}>
                                        <span className={cx("checkmark")}>
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                    </div>
                                    <div className={cx("label")}>
                                        I have read and agree to QuiZone's{" "}
                                        <Link className={cx("link")} to="/">
                                            Terms & Confitions
                                        </Link>
                                    </div>
                                </label>
                                <div
                                    className={cx("notify", {
                                        visible:
                                            errors.agreement &&
                                            touched.agreement,
                                    })}
                                >
                                    <FontAwesomeIcon
                                        className={cx("icon")}
                                        icon={faCircleExclamation}
                                    />
                                    {errors.agreement || "Placehoder"}
                                </div>
                            </div>
                            <Button
                                className={cx("submit-button")}
                                primary
                                type="submit"
                                onClick={() => validateForm()}
                            >
                                Sign Up
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div className={cx("switch")}>
                    Already have an account?
                    <Link className={cx("link")} to="/login">
                        Sign in
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}

export default Register;
