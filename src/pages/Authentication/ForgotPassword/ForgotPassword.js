import {
    faCheckCircle,
    faCircleExclamation,
    faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link } from "react-router-dom";
// import usersApi from "~/api/usersApi";

import Button from "~/components/Button";
import Image from "~/components/Image";

import style from "../Authentication.module.scss";
import images from "~/components/assets/images";

const cx = classNames.bind(style);

function ForgotPassword() {
    const [notify, setNotify] = useState("");

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
        <div className={cx("wrapper", "forgot-password")}>
            <div className={cx("control")}>
                <div className={cx("logo-wrapper")}>
                    <Image className={cx("logo")} src={images.logo} />
                </div>
                <h1 className={cx("heading")}>Forgot Password</h1>
                <p className={cx("request")}>
                    Please enter the email address you register your account
                    with.
                    <br />
                    We will send you reset password confirmation to this email.
                </p>
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
                        email: "",
                    }}
                    onSubmit={(values) => {
                        // (async function handleForgotPassword() {
                        //     try {
                        //         const response = await usersApi.forgotPassword(
                        //             values.email
                        //         );
                        //         if (response.success) {
                        //             setNotify({
                        //                 status: "success",
                        //                 data: `${response.data}. Please check your email.`,
                        //             });
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

                            <Button
                                className={cx("submit-button")}
                                primary
                                type="submit"
                                onClick={() => validateForm()}
                            >
                                Send Email
                            </Button>
                        </Form>
                    )}
                </Formik>
                <div className={cx("switch")}>
                    Don't have account?
                    <Link className={cx("link")} to="/register">
                        Register now
                    </Link>
                    .
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
