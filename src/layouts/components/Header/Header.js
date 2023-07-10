import React, { useState } from "react";
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBIcon,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
} from "mdb-react-ui-kit";
import images from "~/components/assets/images";
import classNames from "classnames/bind";
import style from "./Header.module.scss";
import "./Header.scss";
import Button from "~/components/Button/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import routes from "~/configs/routes";
import { useCookie } from "~/hooks";
import { useEffect } from "react";
import usersApi from "~/api/usersApi/usersApi";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAdd,
    faArrowRightFromBracket,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";

const cx = classNames.bind(style);

var delete_cookie = function (name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export default function Header() {
    const [showBasic, setShowBasic] = useState(false);
    const { pathname } = useLocation();
    const accessToken = useCookie("access_token");
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        (async function handleLogin() {
            try {
                const response = await usersApi.getUserDetails(accessToken);
                let result = response;
                console.log(result);
                if (result.status === "success") {
                    setLoggedIn(true);
                    if (response.user) {
                        setUserName(result.user);
                    }
                } else {
                    setLoggedIn(false);
                    delete_cookie("access_token");
                }
            } catch (error) {
                setLoggedIn(false);
            }
        })();
    }, [accessToken]);

    return (
        <header className="fixed-top">
            <MDBNavbar
                className={cx("nav")}
                expand="lg"
                dark
                fixed="true"
                id="header-nav"
                bgColor="--header-bg-color"
            >
                <MDBContainer fluid>
                    <MDBNavbarBrand
                        onClick={() => {
                            navigate(routes.home);
                        }}
                    >
                        <img
                            className={cx("logo")}
                            src={images.logo}
                            alt="QuiZer"
                        />
                    </MDBNavbarBrand>

                    <MDBNavbarToggler
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={() => setShowBasic(!showBasic)}
                    >
                        <MDBIcon icon="bars" fas />
                    </MDBNavbarToggler>

                    <MDBCollapse navbar show={showBasic}>
                        <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    active={
                                        pathname === routes.home ||
                                        pathname === routes.default
                                    }
                                    aria-current="page"
                                >
                                    <NavLink to="/#">Home</NavLink>
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    active={pathname === routes.join}
                                >
                                    <NavLink to={routes.join}>Play</NavLink>
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                            <MDBNavbarItem>
                                <MDBNavbarLink
                                    active={pathname === routes.myQuizz}
                                >
                                    <NavLink to={routes.myQuizz}>
                                        Library
                                    </NavLink>
                                </MDBNavbarLink>
                            </MDBNavbarItem>
                        </MDBNavbarNav>
                        {!loggedIn ? (
                            <div>
                                <div className="d-flex">
                                    <Button to={routes.login} primary>
                                        Login
                                    </Button>
                                    <Button to={routes.register} outline>
                                        Sign up
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            userName && (
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="success"
                                        id="dropdown-basic"
                                    >
                                        {userName}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align={"end"}>
                                        <Dropdown.Item
                                            onClick={() => {
                                                navigate(routes.login);
                                            }}
                                        >
                                            New Account
                                            <FontAwesomeIcon
                                                icon={faSquarePlus}
                                            />
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => {
                                                setLoggedIn(false);
                                                setUserName("");
                                                delete_cookie("access_token");
                                            }}
                                        >
                                            Log out
                                            <FontAwesomeIcon
                                                icon={faArrowRightFromBracket}
                                            />
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )
                        )}
                    </MDBCollapse>
                </MDBContainer>
            </MDBNavbar>
        </header>
    );
}
