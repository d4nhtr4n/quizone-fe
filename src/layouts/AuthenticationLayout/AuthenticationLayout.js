import classNames from "classnames/bind";
import PropTypes from "prop-types";
import style from "./AuthenticationLayout.module.scss";

const cx = classNames.bind(style);

function AuthenticationLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("container")}>
                <div className={cx("content")}>{children}</div>
            </div>
        </div>
    );
}

AuthenticationLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthenticationLayout;
