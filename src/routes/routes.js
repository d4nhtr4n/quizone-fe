import configs from "~/configs";
import Home from "~/pages/Home/Home";
import Login from "~/pages/Authentication/Login";
import Register from "~/pages/Authentication/Register";
import AuthenticationLayout from "~/layouts/AuthenticationLayout/AuthenticationLayout";
import ForgotPassword from "~/pages/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "~/pages/Authentication/ResetPassword/ResetPassword";
import Join from "~/pages/Join/Join";
import Play from "~/pages/Play/Play";
import FullScreenLayout from "~/layouts/FullScreenLayout/FullScreenLayout";
import MyQuizz from "~/pages/MyQuizz/MyQuizz";
import Host from "~/pages/Host/Host";

const publicRoutes = [
    { path: configs.routes.default, component: Home },
    { path: configs.routes.home, component: Home },
    {
        path: configs.routes.login,
        component: Login,
        layout: AuthenticationLayout,
    },
    {
        path: configs.routes.register,
        component: Register,
        layout: AuthenticationLayout,
    },
    {
        path: configs.routes.forgotPassword,
        component: ForgotPassword,
        layout: AuthenticationLayout,
    },
    {
        path: configs.routes.resetPassword,
        component: ResetPassword,
        layout: AuthenticationLayout,
    },
    {
        path: configs.routes.join,
        component: Join,
    },
    {
        path: configs.routes.play,
        component: Play,
        layout: FullScreenLayout,
    },
    {
        path: configs.routes.myQuizz,
        component: MyQuizz,
    },
    {
        path: configs.routes.host,
        component: Host,
        layout: FullScreenLayout,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
