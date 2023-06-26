import classNames from "classnames/bind";
import style from "./Answear.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faDiamond,
    faShield,
    faSquare,
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(style);
const answearColors = ["#E21B3C", "#D89E00", "#26890C", "#1368CE"];
const answearIcons = [
    <FontAwesomeIcon className={cx("icon")} icon={faSquare} />,
    <FontAwesomeIcon className={cx("icon")} icon={faCircle} />,
    <FontAwesomeIcon className={cx("icon")} icon={faDiamond} />,
    <FontAwesomeIcon className={cx("icon")} icon={faShield} />,
];
export default function Answear({
    client = false,
    value,
    index,
    selected,
    onClick,
}) {
    return (
        <div
            className={cx("wrapper", {
                client: client,
            })}
        >
            <div
                style={{ color: answearColors[index] }}
                className={cx("content", {
                    selected: selected,
                })}
                onClick={() => onClick(index)}
            >
                {answearIcons[index]}
                <span className={cx("text")}>{value}</span>
            </div>
        </div>
    );
}
