import { useState } from "react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import usersApi from "~/api/usersApi/usersApi";
import Button from "~/components/Button/Button";
import { useCookie } from "~/hooks";
import classNames from "classnames/bind";
import style from "./Report.module.scss";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdb-react-ui-kit";

const cx = classNames.bind(style);

export default function Report() {
    let { id } = useParams();
    const accessToken = useCookie("access_token");
    const [reportList, setReportList] = useState([]);
    const [currentReport, setCurrentReport] = useState();
    const [currentReportDetails, setCurrentReportDetails] = useState([]);
    useEffect(() => {
        (async function handleGetList() {
            try {
                const response = await usersApi.getReportList(accessToken, id);
                let result = response;
                console.log(result);
                if (result.status === "success") {
                    setReportList(result.data.reports);
                    if (result.data.reports && result.data.reports.length > 0) {
                        setCurrentReport(result.data.reports[0].id);
                    }
                }
            } catch (error) {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async function handleGetReport() {
            try {
                const response = await usersApi.getReportDetail(
                    accessToken,
                    currentReport
                );
                let result = response;
                if (result.status === "success") {
                    setCurrentReportDetails(result.data.report);
                }
                console.log(result);
            } catch (error) {}
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentReport]);

    return (
        <div>
            {reportList && reportList.length > 0 && (
                <Container>
                    <Row>
                        <Col md={3}>
                            <div className={cx("report-list")}>
                                {reportList.map((report, index) => {
                                    const date = new Date(report.createdAt);
                                    return (
                                        <div
                                            key={index}
                                            className={cx("report-btn", {
                                                selected:
                                                    report.id === currentReport,
                                            })}
                                            onClick={() =>
                                                setCurrentReport(report.id)
                                            }
                                        >
                                            {date
                                                .toString()
                                                .slice(
                                                    0,
                                                    date
                                                        .toString()
                                                        .indexOf("GMT")
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Col>
                        <Col md={9}>
                            {currentReportDetails &&
                                currentReportDetails.length > 0 && (
                                    <div className={cx("report-details")}>
                                        {currentReportDetails.map(
                                            (reportDetail, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={cx(
                                                            "table-wrapper"
                                                        )}
                                                    >
                                                        <h1>{`Question ${
                                                            index + 1
                                                        }: ${
                                                            reportDetail
                                                                .question
                                                                .question
                                                        }`}</h1>
                                                        <div
                                                            className={cx(
                                                                "quiz-info"
                                                            )}
                                                        >
                                                            <p>
                                                                Type:
                                                                {reportDetail
                                                                    .question
                                                                    .type ===
                                                                "quiz"
                                                                    ? " Quiz"
                                                                    : " True/False"}
                                                            </p>
                                                            <p>
                                                                {`Max points: ${
                                                                    reportDetail
                                                                        .question
                                                                        .time_waiting *
                                                                    100
                                                                }`}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <MDBTable
                                                                align="left"
                                                                small
                                                                className="table-dark"
                                                            >
                                                                <MDBTableHead>
                                                                    <tr>
                                                                        <th>
                                                                            Name
                                                                        </th>
                                                                        <th>
                                                                            Answer
                                                                        </th>
                                                                        <th
                                                                            style={{
                                                                                textAlign:
                                                                                    "right",
                                                                            }}
                                                                        >
                                                                            Points
                                                                        </th>
                                                                    </tr>
                                                                </MDBTableHead>
                                                                <MDBTableBody>
                                                                    {reportDetail.data.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <tr
                                                                                style={{
                                                                                    color:
                                                                                        item.point >
                                                                                        0
                                                                                            ? "#2FBE14"
                                                                                            : "#F20606",
                                                                                }}
                                                                                key={
                                                                                    item.name
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        reportDetail
                                                                                            .question[
                                                                                            `answer${item.answer}`
                                                                                        ]
                                                                                    }
                                                                                </td>
                                                                                <td
                                                                                    style={{
                                                                                        textAlign:
                                                                                            "right",
                                                                                    }}
                                                                                >
                                                                                    {
                                                                                        item.point
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </MDBTableBody>
                                                            </MDBTable>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}
