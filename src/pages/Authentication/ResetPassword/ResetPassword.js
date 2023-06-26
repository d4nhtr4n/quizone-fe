import {
    faCheckCircle,
    faCircleExclamation,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import usersApi from "~/api/usersApi";

import Button from "~/components/Button";
import Image from "~/components/Image";

import style from "../Authentication.module.scss";
import images from "~/components/assets/images";

const cx = classNames.bind(style);

function ResetPassword() {
    const { token } = useParams();
    const [notify, setNotify] = useState("");
    const navigate = useNavigate();

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

    return (
        <div className={cx("wrapper", "reset-password")}>
            <div className={cx("control")}>
                <div className={cx("logo-wrapper")}>
                    <Image className={cx("logo")} src={images.logo} />
                </div>
                <h1 className={cx("heading")}>Reset Password</h1>
                <div
                    className={cx("password-config-notify", {
                        success: notify.status === "success",
                        error: notify.status === "error",
                    })}
                >
                    <FontAwesomeIcon
                        className={cx("icon", "success")}
                        icon={faCheckCircle}
                    />
                    <FontAwesomeIcon
                        className={cx("icon", "error")}
                        icon={faCircleXmark}
                    />

                    <span>{notify.data}</span>
                </div>
                <Formik
                    initialValues={{
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={(values) => {
                        // (async function handleRegister() {
                        //     try {
                        //         const response = await usersApi.resetPassword(
                        //             values.password,
                        //             token
                        //         );
                        //         if (response.success) {
                        //             setNotify({
                        //                 status: "success",
                        //                 data: `${response.data}. You will be redirected to the login page now.`,
                        //             });
                        //             setTimeout(() => {
                        //                 navigate("/login", {
                        //                     replace: true,
                        //                 });
                        //             }, 2000);
                        //         }
                        //     } catch (error) {
                        //         setNotify({
                        //             status: "error",
                        //             data: error.response.data.error,
                        //         });
                        //     }
                        // })();
                    }}
                >
                    {({ values, errors, touched, validateForm }) => (
                        <Form className={cx("form")}>
                            <div className={cx("field")}>
                                <div className={cx("input-wrapper")}>
                                    <Field
                                        name="password"
                                        type="password"
                                        validate={validatePassword}
                                        required
                                    />
                                    <p>New Password</p>
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

                            <Button
                                className={cx("submit-button")}
                                primary
                                type="submit"
                                onClick={() => validateForm()}
                            >
                                Reset Password
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default ResetPassword;
