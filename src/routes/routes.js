import configs from "~/configs";
import Home from "~/pages/Home/Home";
import Login from "~/pages/Login/Login";
import Register from "~/pages/Register/Register";

const publicRoutes = [
    { path: configs.routes.default, component: Home },
    { path: configs.routes.home, component: Home },
    { path: configs.routes.login, component: Login },
    { path: configs.routes.register, component: Register },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
