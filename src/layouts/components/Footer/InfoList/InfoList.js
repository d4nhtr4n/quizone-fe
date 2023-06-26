import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import style from "./InfoList.module.scss";

const cx = classNames.bind(style);

function InfoList({ data }) {
    return (
        <div className={cx("wrapper")}>
            <h4 className={cx("title")}>{data.title}</h4>
            <div className={cx("list")}>
                {data.list.map((item, index) => (
                    <Link key={index} to={item.to} className={cx("item")}>
                        {item.text}
                    </Link>
                ))}
            </div>
        </div>
    );
}

InfoList.propTypes = {
    data: PropTypes.object.isRequired,
};

export default InfoList;
