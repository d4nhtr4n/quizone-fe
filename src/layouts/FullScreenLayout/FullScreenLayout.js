import classNames from "classnames/bind";
import PropTypes from "prop-types";
import style from "./FullScreenLayout.module.scss";

const cx = classNames.bind(style);

function FullScreenLayout({ children }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("content")}>{children}</div>
        </div>
    );
}

FullScreenLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FullScreenLayout;
