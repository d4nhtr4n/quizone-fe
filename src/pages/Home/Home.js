import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import Carousel from "react-multi-carousel";
import {
    StackedCarousel,
    ResponsiveContainer,
} from "react-stacked-center-carousel";
import { Field, Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleRight,
    faAngleLeft,
    faCheck,
    faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import "./Home.scss";
import style from "./Home.module.scss";
import "react-multi-carousel/lib/styles.css";

import Image from "~/components/Image/Image";
import images from "~/components/assets/images";
import Card from "~/components/Card/Card";
import Button from "~/components/Button/Button";
import { Container } from "react-bootstrap";

const cx = classNames.bind(style);

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1200 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 1200, min: 1080 },
        items: 3,
        slidesToSlide: 1,
    },
    largeMobile: {
        breakpoint: { max: 1080, min: 640 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 640, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const articles = [
    {
        image: "https://assets.entrepreneur.com/content/3x2/2000/1652359745-Ent-2MPuzzle.jpeg",
        name: "Even the all-powerful Pointing has no control about",
        date: "21 April 2023",
    },
    {
        image: "https://www.thoughtco.com/thmb/QjNC0pABl0Q3BNzT4v7m0B1uYu8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/wholegroup-56db259f3df78c5ba0445e90.jpg",
        name: "Studying about animal vocabularies",
        date: "21 April 2023",
    },
    {
        image: "https://static.uni-graz.at/fileadmin/_processed_/4/4/csm_Working_36aa99ef3d.jpg",
        name: "Teamwork makes perfection",
        date: "21 April 2023",
    },
    {
        image: "https://www.orbiteyehospital.in/images/eye_health.jpg",
        name: "Minigame Eyes Hospital",
        date: "21 April 2023",
    },
    {
        image: "https://www.studyinternational.com/wp-content/uploads/2018/12/Quiz-Do-you-know-the-world%E2%80%99s-capital-cities.jpg",
        name: "Knowing more about the capital cities all around the world",
        date: "21 April 2023",
    },
];

const feedbacks = [
    {
        cover: "https://i.imgur.com/NYtxOry.png",
        name: "Kate Denson",
        job: "Digital Designer",
        feedback:
            "Lorem ipsum dolor sit amet, consectet adip incididunt ut labore et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem dolor sit am.",
    },
    {
        cover: "https://i.imgur.com/ScNanhF.png",
        name: "Jeff Smith",
        job: "English Teacher",
        feedback:
            "Lorem ipsum dolor sit amet, consectet adip incididunt ut labore et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem dolor sit am.",
    },
    {
        cover: "https://i.imgur.com/aAHL7RK.png",
        name: "Christopher Green",
        job: "Student",
        feedback:
            "Lorem ipsum dolor sit amet, consectet adip incididunt ut labore et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem dolor sit am.",
    },
    {
        cover: "https://i.imgur.com/iLz10YP.png",
        name: "Stephen Louis",
        job: "Interpreter",
        feedback:
            "Lorem ipsum dolor sit amet, consectet adip incididunt ut labore et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem dolor sit am.",
    },
    {
        cover: "https://i.imgur.com/3uWo90a.png",
        name: "Adan Pritchard",
        job: "Developer",
        feedback:
            "Lorem ipsum dolor sit amet, consectet adip incididunt ut labore et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem ipsum dolor sit am et dolor. Lorem dolor sit am.",
    },
];

const validateEmail = (value) => {
    let error;
    if (!value) {
        error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "Invalid email address";
    }
    return error;
};

const Home = () => {
    const [centerSlideDataIndex, setCenterSlideDataIndex] = useState(0);
    const [loginFailed, setLoginFailed] = useState(false);

    const articleRef = useRef();
    const feedbackRef = useRef();

    useEffect(() => {
        const intervalId = setInterval(() => {
            feedbackRef.current?.goNext();
        }, 4000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const onCenterSlideDataIndexChange = (newIndex) => {
        setCenterSlideDataIndex(newIndex);
    };

    return (
        <Container>
            <div className={cx("wrapper")} id="home">
                <div className={cx("introduction")}>
                    <div className={cx("text-container")}>
                        <h1>
                            Play online quiz & Learn new concepts for each
                            question
                        </h1>
                        <h5>
                            Quizzify your mind. Enter our web and embrace the
                            challenge.
                        </h5>
                        <h4>
                            <span>20,000+</span> active users right now
                        </h4>
                    </div>
                    <Image
                        src={images.computer}
                        alt="Computer-Illustration"
                        className={cx("")}
                    />
                </div>
                <div className={cx("usage")}>
                    <h1>Easy To Use</h1>
                    <div className={cx("row")}>
                        <article>
                            <Image
                                className={cx("image")}
                                src={images.step1}
                                alt="Step1"
                            />
                            <h5>Step 1</h5>
                            <p>Enter your Email and Click Register</p>
                        </article>
                        <article>
                            <Image
                                src={images.step2}
                                alt="Step2"
                                className={cx("")}
                            />
                            <h5>Step 2</h5>
                            <p>Enter the PIN Code, Your name and click Join.</p>
                        </article>
                        <article>
                            <Image
                                src={images.step5}
                                alt="Step5"
                                className={cx("")}
                            />
                            <h5>Step 3</h5>
                            <p>A question will have four options</p>
                        </article>
                        <article>
                            <Image
                                src={images.step6}
                                alt="Step6"
                                className={cx("")}
                            />
                            <h5>Step 4</h5>
                            <p>Click right Option.</p>
                        </article>
                    </div>
                </div>
                <div className={cx("challenges")}>
                    <div className={cx("header")}>
                        <h1>Let's Sharp Your Preparation</h1>
                        <div className={cx("button-container")}>
                            <Button outline>Explore all</Button>
                        </div>
                    </div>
                    <div className={cx("description")}>
                        <div>
                            <div className={cx("model")}>
                                <h2>BCS Model Test</h2>
                                <p>
                                    Orci varius natoque penatibus et magnis dis
                                    parturient montes, nascetur ridiculus mus.
                                    Etiam placerat tortor commodo lectus laoreet
                                    venenatis.
                                </p>
                            </div>
                            <Image
                                src={images.learningBoy}
                                alt="Learning Boy"
                            />
                        </div>
                        <div>
                            <Image
                                src={images.primaryExam}
                                alt="Primary Exam"
                            />
                            <h3>Primary Exam</h3>
                        </div>
                    </div>
                    <div className={cx("exams")}>
                        <div>
                            <Image src={images.bankExam} alt="Bank Exam" />
                            <h3>Bank Exam</h3>
                        </div>
                        <div>
                            <Image src={images.nsiExam} alt="NSI Exam" />
                            <h3>NSI Exam</h3>
                        </div>
                        <div>
                            <Image
                                src={images.railwayExam}
                                alt="Railway Exam"
                            />
                            <h3>Railway Exam</h3>
                        </div>
                    </div>
                </div>
                {/* <div className={cx("categories")}>
                    <div className={cx("header")}>
                        <h1>Let's Sharp Your Preparation</h1>
                        <div className={cx("button-container")}>
                            <Button outline>Explore all</Button>
                        </div>
                    </div>
                    <div className={cx("main-container")}>
                        <div className={cx("left-section")}>
                            <div className={cx("math-type")}>
                                <Image src={images.math} alt="Math" />
                                <h3>Math</h3>
                                <p>
                                    Sky was cloudless and of a deep dark blue
                                    spectacle before us was indeed.
                                </p>
                            </div>
                            <div className={cx("science-type")}>
                                <Image src={images.science} alt="Science" />
                                <h3>Science</h3>
                                <p>
                                    Unorthographic life One day however a small
                                    line of blind text.
                                </p>
                            </div>
                        </div>
                        <div className={cx("right-section")}>
                            <div className={cx("english-type")}>
                                <Image src={images.english} alt="English" />
                                <h3>English</h3>
                                <p>
                                    Even the all-powerful Pointing has no
                                    control about the blind texts.
                                </p>
                            </div>
                            <div className={cx("other-types")}>
                                <div className={cx("bangla-type")}>
                                    <Image src={images.bangla} alt="Bangla" />
                                    <h3>Bangla</h3>
                                    <p>
                                        However a small line of blind text by
                                        the name.
                                    </p>
                                </div>
                                <div className={cx("general-type")}>
                                    <Image
                                        src={images.english}
                                        alt="General Knowledge"
                                    />
                                    <h3>General Knowledge</h3>
                                    <p>
                                        Text by the name of Lorem Ipsum decided
                                        to leave for the far World of Grammar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className={cx("articles")}>
                    <div className={cx("articles-header")}>
                        <div>
                            <h1>Check Latest Articles</h1>
                        </div>
                        <div className={cx("arrow-container")}>
                            <div
                                className={cx("arrow")}
                                onClick={() => {
                                    articleRef.current.previous();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleLeft}
                                    color="#5f5f5f"
                                    width="12"
                                    height="12"
                                />
                            </div>
                            <div
                                className={cx("arrow")}
                                onClick={() => {
                                    articleRef.current.next();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleRight}
                                    color="#5f5f5f"
                                    width="12"
                                    height="12"
                                />
                            </div>
                        </div>
                    </div>
                    <Carousel
                        ref={articleRef}
                        swipeable={true}
                        arrows={false}
                        showDots={false}
                        responsive={responsive}
                        ssr={true}
                        infinite={true}
                        keyBoardControl={true}
                        sliderClass="-mr-[40px]"
                        itemClass="carousel-container"
                    >
                        {articles?.map((item, index) => (
                            <div
                                key={index}
                                className={cx("article-container")}
                            >
                                <Image
                                    src={item.image}
                                    className={cx("article-img")}
                                    alt={item.name}
                                />
                                <div>
                                    <h5 title={item.name}>{item.name}</h5>
                                    <p>{item.date}</p>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className={cx("testimonial")}>
                    <h1>People Say About Us</h1>
                    <div className={cx("feedback-container")}>
                        <ResponsiveContainer
                            carouselRef={feedbackRef}
                            render={(parentWidth, carouselRef) => {
                                let currentVisibleSlide = 5;
                                if (parentWidth <= 1440)
                                    currentVisibleSlide = 3;
                                if (parentWidth <= 1080)
                                    currentVisibleSlide = 1;
                                return (
                                    <StackedCarousel
                                        ref={carouselRef}
                                        slideComponent={Card}
                                        slideWidth={
                                            parentWidth < 800
                                                ? parentWidth - 40
                                                : 750
                                        }
                                        carouselWidth={parentWidth}
                                        data={feedbacks}
                                        currentVisibleSlide={
                                            currentVisibleSlide
                                        }
                                        onActiveSlideChange={
                                            onCenterSlideDataIndexChange
                                        }
                                        maxVisibleSlide={5}
                                        fadeDistance={0.8}
                                        swipeThreshold={0}
                                        useGrabCursor
                                        className="!overflow-visible"
                                    />
                                );
                            }}
                        />
                        <>
                            <div
                                className={cx("arrow left-arrow")}
                                onClick={() => {
                                    feedbackRef.current?.goBack();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleLeft}
                                    color="#5f5f5f"
                                    width="12"
                                    height="12"
                                />
                            </div>
                            <div
                                className={cx("arrow right-arrow")}
                                onClick={() => {
                                    feedbackRef.current?.goNext();
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faAngleRight}
                                    color="#5f5f5f"
                                    width="12"
                                    height="12"
                                />
                            </div>
                        </>
                        <div className={cx("pagination")}>
                            {feedbacks.map((_, index) => {
                                const isCenterSlide =
                                    centerSlideDataIndex === index;
                                return (
                                    <div
                                        key={index}
                                        className={cx("dot", {
                                            active: isCenterSlide,
                                        })}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={cx("contacts")}>
                    <div className={cx("wrapper")}>
                        <h1>
                            <span>Get In Touch</span>
                        </h1>
                        <h5>Connect. Communicate. Contact us today.</h5>
                        <Formik
                            initialValues={{
                                name: "",
                                email: "",
                                message: "",
                            }}
                            onSubmit={(values) => {
                                console.log(values);
                            }}
                        >
                            {({ errors, touched, validateForm }) => (
                                <Form className={cx("form")}>
                                    <div className={cx("input-wrapper")}>
                                        <Field name="name" required />
                                        <p>Name</p>
                                        {/* <span /> */}
                                    </div>

                                    <div className={cx("field")}>
                                        <div className={cx("input-wrapper")}>
                                            <Field
                                                name="email"
                                                validate={validateEmail}
                                                required
                                            />
                                            <p>Email</p>
                                            {/* <span
                          className={cx({
                            error: errors.email && touched.email,
                          })}
                        /> */}
                                        </div>
                                        <div
                                            className={cx("notify", {
                                                visible:
                                                    errors.email &&
                                                    touched.email,
                                            })}
                                        >
                                            <FontAwesomeIcon
                                                className={cx("icon")}
                                                icon={faCircleExclamation}
                                            />
                                            {errors.email || "Placehoder"}
                                        </div>
                                    </div>

                                    <div className={cx("input-wrapper")}>
                                        <Field
                                            name="message"
                                            as="textarea"
                                            rows="6"
                                            required
                                        />
                                        <p>Message</p>
                                    </div>
                                    <Button
                                        className={cx("submit-button")}
                                        primary
                                        type="submit"
                                        onClick={() => validateForm()}
                                    >
                                        SUBMIT
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Home;
