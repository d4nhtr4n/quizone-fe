const routes = {
    default: "/*",
    home: "/",
    login: "/login",
    register: "/register",
    forgotPassword: "/forgotpassword",
    resetPassword: "/resetpassword/:token",
    join: "/join",
    play: "/play/:pinCode/:name",
    myQuizz: "/myquizz",
    create: "/create",
    host: "/host/:id",
    edit: "/edit/:id",
};

export default routes;
