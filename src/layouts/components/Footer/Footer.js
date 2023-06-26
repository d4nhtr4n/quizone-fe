import {
    faFacebookF,
    faLinkedinIn,
    faRedditAlien,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Image from "~/components/Image";
import style from "./Footer.module.scss";
import InfoList from "./InfoList";
import images from "~/components/assets/images";

const cx = classNames.bind(style);

const USEFULL_LINKS = {
    title: "Usefull Links",
    list: [
        { text: "FAQ's", to: "" },
        { text: "Explore", to: "" },
        { text: "Newlesters", to: "" },
        { text: "Support", to: "" },
        { text: "Help Center", to: "" },
    ],
};

const COMPANY_LINKS = {
    title: "Company",
    list: [
        { text: "About Us", to: "" },
        { text: "Careers", to: "" },
        { text: "Partners", to: "" },
    ],
};

const LEGAL_LINKS = {
    title: "Legal",
    list: [
        { text: "Cookies Policy", to: "" },
        { text: "Legal Notices", to: "" },
        { text: "Privacy Policy", to: "" },
        { text: "Teams & Conditions", to: "" },
    ],
};

function Footer() {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("inner")}>
                <Container>
                    <Row>
                        <Col lg={4} md={4} sm={12}>
                            <div className={cx("intro")}>
                                <Image
                                    src={images.logoWithText}
                                    className={cx("logo")}
                                />
                                <p className={cx("info")}>
                                    Test your knowledge and challenge your
                                    friends with our interactive quizzes!
                                </p>
                            </div>
                        </Col>
                        <Col lg={{ span: 7, offset: 1 }} md={8} sm={12}>
                            <Container fluid>
                                <Row>
                                    <Col
                                        className={cx("link-group")}
                                        sm={4}
                                        xs={12}
                                    >
                                        <InfoList data={USEFULL_LINKS} />
                                    </Col>
                                    <Col
                                        className={cx("link-group")}
                                        sm={4}
                                        xs={12}
                                    >
                                        <InfoList data={COMPANY_LINKS} />
                                    </Col>
                                    <Col
                                        className={cx("link-group")}
                                        sm={4}
                                        xs={12}
                                    >
                                        <InfoList data={LEGAL_LINKS} />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <div className={cx("line")} />
                <div className={cx("bottom")}>
                    <div className={cx("copyright")}>
                        <span>Copyright</span>
                        <FontAwesomeIcon
                            icon={faCopyright}
                            className={cx("icon")}
                        />
                        <span>2023 QuiZone. All Rights Reserved.</span>
                    </div>
                    <ul className={cx("social-list")}>
                        <li className={cx("social-item")}>
                            <Link to=" ">
                                <FontAwesomeIcon icon={faFacebookF} />
                            </Link>
                        </li>
                        <li className={cx("social-item")}>
                            <Link to=" ">
                                <FontAwesomeIcon icon={faTwitter} />
                            </Link>
                        </li>
                        <li className={cx("social-item")}>
                            <Link to=" ">
                                <FontAwesomeIcon icon={faLinkedinIn} />
                            </Link>
                        </li>
                        <li className={cx("social-item")}>
                            <Link to=" ">
                                <FontAwesomeIcon icon={faRedditAlien} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Footer;
