import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import classNames from "classnames/bind";

import style from "./NoFooterLayout.module.scss";
const cx = classNames.bind(style);
function NoFooterLayout({ children }) {
    return (
        <div>
            <Header />
            <div className={cx("content")}>
                <div>{children}</div>
            </div>
            {/* <Footer /> */}
        </div>
    );
}

export default NoFooterLayout;
