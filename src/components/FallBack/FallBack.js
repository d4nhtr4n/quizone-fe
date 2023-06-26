import classNames from "classnames/bind";
import Image from "~/components/Image";
import style from "./FallBack.module.scss";

const cx = classNames.bind(style);

function FallBack({ data }) {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("inner")}>
                <div className={cx("image-wrapper")}>
                    <Image className={cx("image")} src={data.image} />
                    <div className={cx("glow")}></div>
                </div>
                <div className={cx("notification")}>
                    <h2 className={cx("title")}>{data.title}</h2>
                    <h3 className={cx("detail")}>{data.detail}</h3>
                </div>
                {
                    <div className={cx("actions")}>
                        {data.buttons.map((button, index) => (
                            <div className={cx("button")} key={index}>
                                {button}
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}

export default FallBack;
