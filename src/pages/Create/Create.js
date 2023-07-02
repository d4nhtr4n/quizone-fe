import React, { useState, useEffect, useRef } from "react";
import {
    unstable_useBlocker as useBlocker,
    useNavigate,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames/bind";
import { Container, Row, Col, Form, Accordion } from "react-bootstrap";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
} from "mdb-react-ui-kit";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPalette,
    faHeadSideCough,
    faClock,
    faCircleCheck,
    faArrowTrendUp,
    faStreetView,
    faRankingStar,
    faXmark,
    faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { Reorder, motion, AnimatePresence } from "framer-motion";

import style from "./Create.module.scss";
import "./Accordion.scss";

import Question from "~/components/Question/Question";
import images from "~/components/assets/images";
import Image from "~/components/Image/Image";
import Button from "~/components/Button/Button";
import Quiz from "~/components/Quiz/Quiz";

import { uploadFile } from "~/firebase/storage";
import { useCookie } from "~/hooks";
import usersApi from "~/api/usersApi/usersApi";
import { userConst } from "~/api/constant";

const cx = classNames.bind(style);

const defaultThumbnail =
    "https://assets-cdn.kahoot.it/builder/v2/assets/placeholder-cover-kahoot-dca23b0a.png";

const timeOptions = [
    { value: "5", label: "5 seconds" },
    { value: "10", label: "10 seconds" },
    { value: "20", label: "20 seconds" },
    { value: "30", label: "30 seconds" },
    { value: "60", label: "1 minutes" },
    { value: "90", label: "1 minutes 30 seconds" },
];

const timeTemplate = ["5s", "10s", "20s", "30s", "1m", "1m30"];

const answerOptions = [
    { value: "single", label: "Single Choice" },
    { value: "multi", label: "Multiple Choice" },
];

const typeOptions = [
    { value: "quiz", label: "Quiz" },
    { value: "truefalse", label: "True/False" },
];

const answerTemplate = ["A", "B", "C", "D"];

const Create = () => {
    const [currentQuestIndex, setCurrentQuestIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);
    const accessToken = useCookie("access_token");

    const [settingModal, setSettingModal] = useState(false);
    const [themeSelect, setThemeSelect] = useState(false);

    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    // const [selectedQuestImg, setSelectedQuestImg] = useState(null);

    const [sessionInfo, setSessionInfo] = useState({
        uid: uuidv4(),
        title: "",
        description: "",
        thumbnailUri: defaultThumbnail || null,
        theme: "",
    });

    const [modalInputs, setModalInputs] = useState({
        title: sessionInfo.title,
        description: sessionInfo.description,
        thumbnailUri: sessionInfo.thumbnailUri || defaultThumbnail || null,
    });

    const [questionsList, setQuestionsList] = useState([
        {
            id: 1,
            question: "",
            imageUri: "",
            selections: ["", "", "", ""],
            answer: "A",
            readingTime: timeOptions[2].value,
            timeLimit: timeOptions[2].value,
            type: "quiz",
            // option: answerOptions[1].value,
        },
    ]);

    const themes = [
        {
            id: 0,
            type: "trendy",
            title: "None",
            imageUrl:
                "https://icon-library.com/images/none-icon/none-icon-0.jpg",
            color: "#fff",
        },
        {
            id: 1,
            type: "trendy",
            title: "Standard",
            imageUrl:
                "https://assets-cdn.kahoot.it/builder/v2/assets/teach_stud_default-ef51b1e5.jpg",
            color: "#00ffff",
        },
        {
            id: 2,
            type: "trendy",
            title: "Pride",
            imageUrl:
                "https://images-cdn.kahoot.it/24ac669e-98ab-470f-94cd-bd28158ecb9c?auto=webp",
            color: "#b100da",
        },
        {
            id: 3,
            type: "trendy",
            title: "Spring",
            imageUrl:
                "https://images-cdn.kahoot.it/36b2d89f-88c4-4456-813f-7f5c45d5f1eb?auto=webp",
            color: "rgb(81, 101, 40)",
        },
        {
            id: 4,
            type: "trendy",
            title: "Summer",
            imageUrl:
                "https://images-cdn.kahoot.it/2bb75e99-6ced-426f-873c-61ffeb531f77?auto=webp",
            color: "rgb(37, 102, 106)",
        },
        {
            id: 5,
            type: "trendy",
            title: "Autumn",
            imageUrl:
                "https://images-cdn.kahoot.it/acf73135-050e-4126-b172-d0dbb436012e?auto=webp",
            color: "rgb(251, 171, 72)",
        },
        {
            id: 6,
            type: "trendy",
            title: "Winter",
            imageUrl:
                "https://images-cdn.kahoot.it/acf73135-050e-4126-b172-d0dbb436012e?auto=webp",
            color: "rgb(234, 241, 250)",
        },
        {
            id: 7,
            type: "trendy",
            title: "Support Ukraine",
            imageUrl:
                "https://images-cdn.kahoot.it/300abeb4-3e5b-4c2c-9103-79510940097c?auto=webp",
            color: "rgb(69, 163, 229)",
        },
        {
            id: 8,
            type: "free",
            title: "Skyscrapers",
            imageUrl:
                "https://images-cdn.kahoot.it/6f0a6ed1-5ff5-47c5-a73e-c3b4be80ce44?auto=webp",
            color: "rgb(34, 53, 103)",
        },
        {
            id: 9,
            type: "free",
            title: "Technology",
            imageUrl:
                "https://images-cdn.kahoot.it/6cc642b3-c6af-41a9-9b25-ba2a9ca2c8b3?auto=webp",
            color: "rgb(7, 130, 146)",
        },
        {
            id: 10,
            type: "free",
            title: "Dark",
            imageUrl:
                "https://images-cdn.kahoot.it/51f5bee6-77ae-4b8f-b9d3-03b708f6a483?auto=webp",
            color: "rgb(58, 59, 74)",
        },
        {
            id: 11,
            type: "free",
            title: "Dessert",
            imageUrl:
                "https://images-cdn.kahoot.it/0917f765-191d-4761-a8d6-14073a5ba9e4?auto=webp",
            color: "rgb(254, 248, 242)",
        },
        {
            id: 12,
            type: "free",
            title: "Light",
            imageUrl:
                "https://images-cdn.kahoot.it/28776a21-92a3-4089-a543-21a718584a52?auto=webp",
            color: "rgb(202, 209, 219)",
        },
        {
            id: 13,
            type: "free",
            title: "Midnight",
            imageUrl:
                "https://images-cdn.kahoot.it/82fc2020-4ea8-457f-80ad-e0c5429a4ec0?auto=webp",
            color: "rgb(93, 97, 134)",
        },
        {
            id: 14,
            type: "professional",
            title: "Space",
            imageUrl:
                "https://images-cdn.kahoot.it/07e0c1ab-fca7-472c-a252-32d43a549864?auto=webp",
            color: "rgb(61, 61, 108)",
        },
        {
            id: 15,
            type: "professional",
            title: "Tennis",
            imageUrl:
                "https://images-cdn.kahoot.it/1d1b87c4-e2f8-49ca-8855-9809bfd4c73e?auto=webp",
            color: "rgb(16, 107, 3)",
        },
        {
            id: 16,
            type: "professional",
            title: "Pride Parade",
            imageUrl:
                "https://images-cdn.kahoot.it/d5af4192-ea8b-46d3-ac3d-4a0407ecbaf7?auto=webp",
            color: "rgb(0, 127, 149)",
        },
        {
            id: 17,
            type: "professional",
            title: "Stage",
            imageUrl:
                "https://images-cdn.kahoot.it/d471bad0-cc61-4c1d-8f53-c09e85787233?auto=webp",
            color: "rgb(95, 31, 46)",
        },
        {
            id: 18,
            type: "professional",
            title: "Celebration",
            imageUrl:
                "https://images-cdn.kahoot.it/a31ca606-34fe-46de-b75b-b115c6b82b39?auto=webp",
            color: "rgb(149, 23, 208)",
        },
        {
            id: 19,
            type: "professional",
            title: "Fireworks",
            imageUrl:
                "https://images-cdn.kahoot.it/d7b8da55-5986-46a6-ad92-13c2f012cecf?auto=webp",
            color: "rgb(79, 64, 168)",
        },
    ];

    const thumbInputRef = useRef(null);
    const questImgInputRef = useRef(null);
    const questionRef = useRef(null);

    const navigate = useNavigate();

    const handleChangeThumbnail = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setSelectedThumbnail(file);
        setIsEditing(true);

        const reader = new FileReader();

        reader.onload = (event) => {
            const imgSrc = event.target.result;
            setModalInputs((prev) => ({
                ...prev,
                thumbnailUri: {
                    file: file,
                    imgSrc: imgSrc,
                },
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleChangeQuestionImg = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setIsEditing(true);

        const reader = new FileReader();

        reader.onload = (event) => {
            const imgSrc = event.target.result;

            const updatedQuests = [...questionsList];
            updatedQuests[currentQuestIndex] = {
                ...updatedQuests[currentQuestIndex],
                imageUri: {
                    file: file,
                    imgSrc: imgSrc,
                },
            };
            setQuestionsList(updatedQuests);
        };

        reader.readAsDataURL(file);
    };

    const handleChangeQuestion = (e) => {
        const updatedQuests = [...questionsList];
        updatedQuests[currentQuestIndex] = {
            ...updatedQuests[currentQuestIndex],
            question: e.target.value.replace(/\n/g, ""),
        };
        setQuestionsList(updatedQuests);
        setIsEditing(true);
    };

    const handleSaveSessionInfo = (code) => {
        if (code === 1) {
            setSessionInfo((prev) => ({
                ...prev,
                ...modalInputs,
            }));
            if (Object.values(modalInputs).some((value) => value !== ""))
                setHasEdited(true);
        } else {
            if (window.confirm("Are you sure want to cancel your input?")) {
                setModalInputs({
                    title: sessionInfo.title,
                    description: sessionInfo.description,
                    thumbnailUri: {
                        imgSrc:
                            sessionInfo.thumbnailUri ||
                            defaultThumbnail ||
                            null,
                    },
                });
                setSelectedThumbnail(null);
            }
        }
        setSettingModal(false);
    };

    const handleInputBlur = (e) => {
        if (e.target.value.length > 0) {
            setIsEditing(false);
            setHasEdited(true);
        } else {
            questionRef.current.focus();
        }
    };

    const changeData = (data) => {
        const { option, index } = data;

        if (option.length > 0) setHasEdited(true);

        setQuestionsList((prevQuestionsList) => {
            const updatedQuestionsList = [...prevQuestionsList];
            const currentQuestion = {
                ...updatedQuestionsList[currentQuestIndex],
            };

            currentQuestion.selections[index] = option;

            updatedQuestionsList[currentQuestIndex] = currentQuestion;
            return updatedQuestionsList;
        });
    };

    const changeAnswer = (data) => {
        const { index } = data;

        setQuestionsList((prevList) => {
            const updatedList = [...prevList];
            const currentQuestion = updatedList[currentQuestIndex];

            if (currentQuestion) {
                currentQuestion.answer = answerTemplate[index];
            }

            return updatedList;
        });
    };

    const handleQuestSettings = (data, type) => {
        setQuestionsList((prevQuestionsList) => {
            const updatedQuestionsList = [...prevQuestionsList];
            const currentQuestion = {
                ...updatedQuestionsList[currentQuestIndex],
            };

            currentQuestion[type] = data.value;

            const selectionLength = currentQuestion.selections.length;

            if (type === "type" && data.value === "quiz") {
                if (selectionLength === 2)
                    currentQuestion.selections = ["", "", "", ""];
            } else if (type === "type" && data.value === "truefalse") {
                if (selectionLength === 4)
                    currentQuestion.selections = ["True", "False"];
            }

            updatedQuestionsList[currentQuestIndex] = currentQuestion;
            return updatedQuestionsList;
        });
    };

    const addNewQuestion = () => {
        setQuestionsList((prevQuestionsList) => [
            ...prevQuestionsList,
            {
                id: prevQuestionsList.length + 1,
                question: "",
                imageUri: "",
                selections: ["", "", "", ""],
                answer: "A",
                readingTime: timeOptions[2].value,
                timeLimit: timeOptions[2].value,
                type: "quiz",
                // option: answerOptions[1].value,
            },
        ]);
    };

    const deleteQuestion = () => {
        const listLength = questionsList.length;
        // Check if there is only one item left in the array
        if (listLength === 1) {
            alert("Cannot delete the last question.");
            return;
        }
        // Remove the item with the given index
        const updatedQuestionsList = questionsList.filter(
            (_, index) => index !== currentQuestIndex
        );

        // Update the id of remaining items from the index of the deleted item
        const updatedQuestionsListWithUpdatedIds = updatedQuestionsList.map(
            (question, index) => ({
                ...question,
                id: index >= currentQuestIndex ? question.id - 1 : question.id,
            })
        );

        // Update the state with the updated questions list
        setQuestionsList(updatedQuestionsListWithUpdatedIds);

        if (currentQuestIndex === listLength - 1) {
            setCurrentQuestIndex(listLength - 2);
        }
    };

    const duplicateQuestion = (index) => {
        // Get the value of question having index in the list
        const originalQuestion = questionsList[index];

        // Duplicate the question
        const duplicatedQuestion = { ...originalQuestion };

        // Place the duplicate question right after the original question
        const updatedQuestionsList = [
            ...questionsList.slice(0, index + 1),
            duplicatedQuestion,
            ...questionsList.slice(index + 1),
        ];

        // Update the id of all questions
        const updatedQuestionsListWithUpdatedIds = updatedQuestionsList.map(
            (question, idx) => ({
                ...question,
                id: idx + 1,
            })
        );

        // Assign updated questions to the list
        setQuestionsList(updatedQuestionsListWithUpdatedIds);

        handleChangeIndex({ index: index + 1 });
    };

    const validateFields = () => {
        // Check sessionInfo fields
        if (!sessionInfo.title) {
            setSettingModal(true);
            toast.error("A quiz session must have a title");
            return false; // Title is required
        }

        // Check questionsList fields
        for (const question of questionsList) {
            if (!question.question) {
                toast.error("There must be a question");
                return false; // Question is required
            }

            if (!question.answer) {
                toast("Each question should have >= 1 answer", {
                    icon: "✅",
                });
                return false; // Answer is required
            }

            if (question.selections.some((selection) => !selection)) {
                toast.error("Please type all selections");
                return false; // All selections must have a value
            }
        }

        return true;
    };

    const handleChangeIndex = ({ index, id }) => {
        let newIndex = -1;

        if (id !== undefined) {
            newIndex = questionsList.findIndex(
                (question) => question.id === id
            );
        } else if (index !== undefined) {
            newIndex = index;
        }

        if (newIndex !== -1) {
            setCurrentQuestIndex(newIndex);
        } else {
            alert("Index not found");
        }
    };

    const saveSession = async () => {
        setIsLoading(true);

        if (validateFields()) {
            // This is for images upload
            if (selectedThumbnail) {
                try {
                    const url = await uploadFile(
                        selectedThumbnail,
                        () => console.log("Đang upload thumbnail"),
                        () => {
                            // Set progress here
                        }
                    );
                    setSessionInfo((prev) => ({
                        ...prev,
                        thumbnailUri: {
                            imgSrc: url,
                        },
                    }));
                } catch (error) {
                    console.log(error);
                    toast.error("Failed to upload thumbnail.");
                    setIsLoading(false);
                    return;
                }
            }

            const updatedQuestionsList = await Promise.all(
                questionsList.map(async (question, index) => {
                    if (!question.imageUri?.file) {
                        return question; // Skip if imageUri.file is empty
                    }

                    try {
                        const url = await uploadFile(
                            question.imageUri.file,
                            () => console.log("Đang upload image"),
                            () => {
                                // Set progress here
                            }
                        );
                        return {
                            ...question,
                            imageUri: url,
                        };
                    } catch (error) {
                        console.log(error);
                        toast.error(
                            "Failed to upload image of question " + index
                        );
                        return question;
                    }
                })
            );

            setQuestionsList(updatedQuestionsList);
            setSelectedThumbnail(null);
            setIsDone(true);
            toast.success("Quiz created successfully!");
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (isEditing) {
            questionRef.current.focus();
            const { value } = questionRef.current;
            questionRef.current.setSelectionRange(value.length, value.length);
        }
    }, [isEditing]);

    useEffect(() => {
        if (isDone && validateFields()) {
            const formData = {
                ...sessionInfo,
                questions: [...questionsList],
            };
            console.log(formData);

            (async function handleCreateQuiz() {
                try {
                    const response = await usersApi.createNewQuiz(
                        accessToken,
                        formData
                    );
                    let result = response;
                    console.log("Create new quizz", result);
                    if (result.status === "success") {
                        console.log(response.data);
                    } else {
                        if (result.error === userConst.authenticationFailed) {
                            // delete_cookie("access_token");
                        }
                    }
                } catch (error) {}
            })();
            // navigate('/myquiz')
        }
    }, [isDone]);

    // useBlocker(
    //   (tx) => {
    //     if (hasEdited) {
    //       const confirm = window.confirm('Your data has not been saved. Do you want to continue?');
    //       if (!confirm) {
    //         tx.abort();
    //         // navigate(tx.location.pathname);
    //       }
    //     }
    //   },
    //   [navigate]
    // );

    return (
        <>
            <div className={cx("wrapper")}>
                <nav className={cx("navbar")}>
                    <section>
                        <Image src={images.logo} />
                        <div
                            className={cx("quizzer-title")}
                            onClick={() => setSettingModal(!settingModal)}
                        >
                            <span>
                                {sessionInfo.title ||
                                    "This is title of this Quizzer"}
                            </span>
                            <Button outline>Settings</Button>
                        </div>
                    </section>

                    <section>
                        <Button
                            outline
                            onClick={() => setThemeSelect(!themeSelect)}
                        >
                            Themes
                        </Button>
                        <span className={cx("divider")}></span>
                        <Button primary onClick={saveSession}>
                            Save
                        </Button>
                        <Button text onClick={() => navigate(-1)}>
                            {" "}
                            Back
                        </Button>
                    </section>
                </nav>

                <main className={cx("main-frame")}>
                    <aside>
                        <h6 className={cx("title")}>Question List</h6>
                        <div className={cx("quiz-container")}>
                            <Reorder.Group
                                values={questionsList}
                                as="div"
                                className={cx("quiz-list")}
                                onReorder={setQuestionsList}
                            >
                                {questionsList?.map((question, index) => (
                                    <Reorder.Item
                                        onMouseUp={() =>
                                            setCurrentQuestIndex(index)
                                        }
                                        key={question.id}
                                        as="div"
                                        value={question}
                                    >
                                        <Quiz
                                            question={question}
                                            index={index}
                                            currentIndex={currentQuestIndex}
                                            onClick={handleChangeIndex}
                                            onRemove={deleteQuestion}
                                            onDuplicate={duplicateQuestion}
                                        />
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                            {/* </div> */}
                            <div className={cx("list-footer")}>
                                <Button primary onClick={addNewQuestion}>
                                    Add Question
                                </Button>
                            </div>
                        </div>
                    </aside>

                    <div className={cx("question-frame")}>
                        {sessionInfo.theme && sessionInfo.theme.imageUrl && (
                            <div
                                className={cx("backdrop")}
                                style={{
                                    backgroundImage:
                                        `url(${sessionInfo.theme?.imageUrl})` ||
                                        null,
                                }}
                            ></div>
                        )}
                        <div className={cx("question-container")}>
                            <div className={cx("question-section")}>
                                {!questionsList[currentQuestIndex]?.question &&
                                    !isEditing && (
                                        <p
                                            className={cx("guidance")}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Please enter your question
                                        </p>
                                    )}
                                {questionsList[currentQuestIndex]?.question &&
                                    !isEditing && (
                                        <p onClick={() => setIsEditing(true)}>
                                            {
                                                questionsList[currentQuestIndex]
                                                    ?.question
                                            }
                                        </p>
                                    )}
                                {isEditing && (
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Control
                                            ref={questionRef}
                                            as="textarea"
                                            rows={2}
                                            value={
                                                questionsList[currentQuestIndex]
                                                    ?.question
                                            }
                                            onChange={(e) =>
                                                handleChangeQuestion(e)
                                            }
                                            onBlur={(e) => handleInputBlur(e)}
                                        />
                                    </Form.Group>
                                )}
                            </div>
                            <figure>
                                <input
                                    ref={questImgInputRef}
                                    type="file"
                                    accept="image/*"
                                    name="questionThumbnail"
                                    id="questionThumb"
                                    onChange={handleChangeQuestionImg}
                                    style={{ display: "none" }}
                                />
                                {questionsList[currentQuestIndex]?.imageUri && (
                                    <Image
                                        src={
                                            questionsList[currentQuestIndex]
                                                ?.imageUri.imgSrc
                                        }
                                        alt="Placeholder Image"
                                    />
                                )}
                                <button
                                    onClick={() =>
                                        questImgInputRef.current.click()
                                    }
                                >
                                    +
                                </button>
                            </figure>
                            <div className={cx("answers")}>
                                <Container>
                                    {questionsList[currentQuestIndex].type ===
                                    "quiz" ? (
                                        <Row style={{ height: "300px" }}>
                                            {questionsList[
                                                currentQuestIndex
                                            ]?.selections.map(
                                                (select, index) => (
                                                    <Col xs={6} key={index}>
                                                        <Question
                                                            data={select}
                                                            correct={
                                                                questionsList[
                                                                    currentQuestIndex
                                                                ]?.answer ===
                                                                answerTemplate[
                                                                    index
                                                                ]
                                                            }
                                                            index={index}
                                                            changeData={
                                                                changeData
                                                            }
                                                            changeAnswer={
                                                                changeAnswer
                                                            }
                                                        />
                                                    </Col>
                                                )
                                            )}
                                        </Row>
                                    ) : (
                                        <Row style={{ height: "200px" }}>
                                            <Col xs={6}>
                                                <Question
                                                    data={
                                                        questionsList[
                                                            currentQuestIndex
                                                        ]?.selections[0]
                                                    }
                                                    correct={
                                                        questionsList[
                                                            currentQuestIndex
                                                        ]?.answer ===
                                                        answerTemplate[0]
                                                    }
                                                    index={0}
                                                    changeData={changeData}
                                                    changeAnswer={changeAnswer}
                                                />
                                            </Col>
                                            <Col xs={6}>
                                                <Question
                                                    data={
                                                        questionsList[
                                                            currentQuestIndex
                                                        ]?.selections[1]
                                                    }
                                                    correct={
                                                        questionsList[
                                                            currentQuestIndex
                                                        ]?.answer ===
                                                        answerTemplate[1]
                                                    }
                                                    index={1}
                                                    changeData={changeData}
                                                    changeAnswer={changeAnswer}
                                                />
                                            </Col>
                                        </Row>
                                    )}
                                </Container>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={themeSelect ? "full" : "empty"}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {themeSelect ? (
                                <div className={cx("question-setting")}>
                                    <div className={cx("title-container")}>
                                        <h6 className={cx("title")}>
                                            Question Theme
                                        </h6>
                                        <FontAwesomeIcon
                                            icon={faXmark}
                                            onClick={() =>
                                                setThemeSelect(!themeSelect)
                                            }
                                        />
                                    </div>
                                    <div className={cx("setting-container")}>
                                        <section>
                                            <Accordion
                                                defaultActiveKey={["0"]}
                                                alwaysOpen
                                            >
                                                <Accordion.Item
                                                    eventKey="0"
                                                    onClick={(e) =>
                                                        console.log(e.target)
                                                    }
                                                >
                                                    <Accordion.Header
                                                        className={cx(
                                                            "accordion-header"
                                                        )}
                                                    >
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faArrowTrendUp
                                                                }
                                                            />
                                                            <h6>Trendy</h6>
                                                        </span>
                                                        <span className="arrow"></span>
                                                    </Accordion.Header>
                                                    <Accordion.Body
                                                        className={cx(
                                                            "accordion-body"
                                                        )}
                                                    >
                                                        {themes
                                                            .filter(
                                                                (theme) =>
                                                                    theme.type ===
                                                                    "trendy"
                                                            )
                                                            .map((theme, i) => (
                                                                <figure
                                                                    key={i}
                                                                    className={cx(
                                                                        "theme-item",
                                                                        {
                                                                            selected:
                                                                                sessionInfo
                                                                                    .theme
                                                                                    .id ===
                                                                                theme.id,
                                                                        },
                                                                        {
                                                                            selected:
                                                                                sessionInfo
                                                                                    .theme
                                                                                    .id ===
                                                                                    undefined &&
                                                                                theme.id ===
                                                                                    0,
                                                                        }
                                                                    )}
                                                                    onClick={() => {
                                                                        if (
                                                                            theme.title !==
                                                                            "None"
                                                                        )
                                                                            setSessionInfo(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    theme,
                                                                                })
                                                                            );
                                                                        else
                                                                            setSessionInfo(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    theme: "",
                                                                                })
                                                                            );
                                                                        {
                                                                        }
                                                                    }}
                                                                >
                                                                    <div
                                                                        className={cx(
                                                                            "item-container"
                                                                        )}
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                theme.imageUrl
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={cx(
                                                                                "theme-title"
                                                                            )}
                                                                            style={{
                                                                                backgroundColor:
                                                                                    theme.color,
                                                                            }}
                                                                        >
                                                                            {
                                                                                theme.title
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </figure>
                                                            ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="1">
                                                    <Accordion.Header
                                                        className={cx(
                                                            "accordion-header"
                                                        )}
                                                    >
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faStreetView
                                                                }
                                                            />
                                                            <h6>Free</h6>
                                                        </span>
                                                        <span className="arrow"></span>
                                                    </Accordion.Header>
                                                    <Accordion.Body
                                                        className={cx(
                                                            "accordion-body"
                                                        )}
                                                    >
                                                        {themes
                                                            .filter(
                                                                (theme) =>
                                                                    theme.type ===
                                                                    "free"
                                                            )
                                                            .map((theme, i) => (
                                                                <figure
                                                                    key={i}
                                                                    className={cx(
                                                                        "theme-item",
                                                                        {
                                                                            selected:
                                                                                sessionInfo
                                                                                    .theme
                                                                                    .id ===
                                                                                theme.id,
                                                                        }
                                                                    )}
                                                                    onClick={() =>
                                                                        setSessionInfo(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                theme,
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    <div
                                                                        className={cx(
                                                                            "item-container"
                                                                        )}
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                theme.imageUrl
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={cx(
                                                                                "theme-title"
                                                                            )}
                                                                            style={{
                                                                                backgroundColor:
                                                                                    theme.color,
                                                                            }}
                                                                        >
                                                                            {
                                                                                theme.title
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </figure>
                                                            ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>

                                                <Accordion.Item eventKey="2">
                                                    <Accordion.Header
                                                        className={cx(
                                                            "accordion-header"
                                                        )}
                                                    >
                                                        <span>
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faRankingStar
                                                                }
                                                            />
                                                            <h6>
                                                                Professional
                                                            </h6>
                                                        </span>
                                                        <span className="arrow"></span>
                                                    </Accordion.Header>
                                                    <Accordion.Body
                                                        className={cx(
                                                            "accordion-body"
                                                        )}
                                                    >
                                                        {themes
                                                            .filter(
                                                                (theme) =>
                                                                    theme.type ===
                                                                    "professional"
                                                            )
                                                            .map((theme, i) => (
                                                                <figure
                                                                    key={i}
                                                                    className={cx(
                                                                        "theme-item",
                                                                        {
                                                                            selected:
                                                                                sessionInfo
                                                                                    .theme
                                                                                    .id ===
                                                                                theme.id,
                                                                        }
                                                                    )}
                                                                    onClick={() =>
                                                                        setSessionInfo(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                theme,
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    <div
                                                                        className={cx(
                                                                            "item-container"
                                                                        )}
                                                                    >
                                                                        <Image
                                                                            src={
                                                                                theme.imageUrl
                                                                            }
                                                                        />
                                                                        <div
                                                                            className={cx(
                                                                                "theme-title"
                                                                            )}
                                                                            style={{
                                                                                backgroundColor:
                                                                                    theme.color,
                                                                            }}
                                                                        >
                                                                            {
                                                                                theme.title
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </figure>
                                                            ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </section>
                                        {/* <div className={cx("footer")}>
                                            <button
                                                disabled={
                                                    questionsList.length <= 1
                                                }
                                            >
                                                Delete
                                            </button>
                                            <button>Duplicate</button>
                                        </div> */}
                                    </div>
                                </div>
                            ) : (
                                <div className={cx("question-setting")}>
                                    <h6 className={cx("title")}>
                                        Question Setting
                                    </h6>
                                    <div className={cx("setting-container")}>
                                        <section>
                                            <span>
                                                <FontAwesomeIcon
                                                    icon={faCircleQuestion}
                                                />
                                                <h6>Question type</h6>
                                            </span>
                                            <Select
                                                className={cx("reading-time")}
                                                onChange={(data) =>
                                                    handleQuestSettings(
                                                        data,
                                                        "type"
                                                    )
                                                }
                                                value={typeOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        questionsList[
                                                            currentQuestIndex
                                                        ].type
                                                )}
                                                options={typeOptions}
                                            />
                                            <span>
                                                <FontAwesomeIcon
                                                    icon={faHeadSideCough}
                                                />
                                                <h6>Reading time</h6>
                                            </span>
                                            <Select
                                                className={cx("reading-time")}
                                                onChange={(data) =>
                                                    handleQuestSettings(
                                                        data,
                                                        "readingTime"
                                                    )
                                                }
                                                value={
                                                    timeOptions[
                                                        timeTemplate.indexOf(
                                                            questionsList[
                                                                currentQuestIndex
                                                            ].readingTime
                                                        )
                                                    ]
                                                }
                                                options={timeOptions}
                                            />
                                            <span>
                                                <FontAwesomeIcon
                                                    icon={faClock}
                                                />
                                                <h6>Time limit</h6>
                                            </span>
                                            <Select
                                                className={cx("time-limit")}
                                                onChange={(data) =>
                                                    handleQuestSettings(
                                                        data,
                                                        "timeLimit"
                                                    )
                                                }
                                                value={
                                                    timeOptions[
                                                        timeTemplate.indexOf(
                                                            questionsList[
                                                                currentQuestIndex
                                                            ].timeLimit
                                                        )
                                                    ]
                                                }
                                                options={timeOptions}
                                            />
                                            <span>
                                                <FontAwesomeIcon
                                                    icon={faCircleCheck}
                                                />
                                                <h6>Answer option</h6>
                                            </span>
                                            <Select
                                                className={cx("answer-option")}
                                                // onChange={(data) => handleQuestSettings(data, 'option')}
                                                defaultValue={answerOptions[0]}
                                                options={answerOptions}
                                            />
                                        </section>
                                        {/* <div className={cx("footer")}>
                                            <button
                                                disabled={
                                                    questionsList.length <= 1
                                                }
                                            >
                                                Delete
                                            </button>
                                            <button>Duplicate</button>
                                        </div> */}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <MDBModal
                    show={settingModal}
                    tabIndex="-1"
                    setShow={setSettingModal}
                >
                    <MDBModalDialog size="lg">
                        <MDBModalContent className={cx("modal-content")}>
                            <MDBModalHeader>
                                <MDBModalTitle className={cx("modal-title")}>
                                    QuiZone Summary
                                </MDBModalTitle>
                                {/* <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setOptSmModal(!optSmModal)}
              ></MDBBtn> */}
                            </MDBModalHeader>
                            <MDBModalBody className={cx("modal-body")}>
                                <Form className={cx("modal-form")}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlInput1"
                                    >
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            onChange={(e) =>
                                                setModalInputs((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            onChange={(e) =>
                                                setModalInputs((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                        />
                                        <p>
                                            Pro tip: a good description will
                                            help other users find your QuiZone.
                                        </p>
                                    </Form.Group>
                                </Form>
                                <section className={cx("right-col")}>
                                    <div className={cx("image-thumbnail")}>
                                        <h6>Cover image</h6>
                                        <figure>
                                            <input
                                                ref={thumbInputRef}
                                                type="file"
                                                accept="image/*"
                                                name="Thumbnail"
                                                id="thumbnailImg"
                                                onChange={handleChangeThumbnail}
                                                style={{ display: "none" }}
                                            />
                                            <Image
                                                src={
                                                    modalInputs.thumbnailUri
                                                        .imgSrc
                                                }
                                                alt="Placeholder Image"
                                            />
                                            <Button
                                                outline
                                                onClick={() =>
                                                    thumbInputRef.current.click()
                                                }
                                            >
                                                Change
                                            </Button>
                                        </figure>
                                    </div>
                                    <h6>Language</h6>
                                    <Form.Select aria-label="Default select example">
                                        <option value="en">English</option>
                                        <option value="vi">Vietnamese</option>
                                        <option value="kr">Korean</option>
                                    </Form.Select>
                                </section>
                            </MDBModalBody>
                            <MDBModalFooter className={cx("modal-footer")}>
                                <Button
                                    outline
                                    // className={cx("cancel-btn")}
                                    onClick={() => handleSaveSessionInfo(0)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    primary
                                    // className={cx("save-btn")}
                                    onClick={() => handleSaveSessionInfo(1)}
                                >
                                    Save changes
                                </Button>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </div>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={cx("overlay")}
                >
                    {/* <div className={cx('overlay')}> */}
                    <div className={cx("loader")}>
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    {/* </div> */}
                </motion.div>
            )}
        </>
    );
};

export default Create;
