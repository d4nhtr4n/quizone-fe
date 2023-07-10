import { category } from "../constant";
import axiosClient from "./axiosClient";

const usersApi = {
    login: (email, password) => {
        const url = `/auth/login`;
        return axiosClient().post(url, {
            email,
            password,
        });
    },
    register: (email, password) => {
        const url = `/auth/signup`;
        return axiosClient().post(url, {
            email,
            password,
        });
    },
    getUserDetails: (token) => {
        const url = `/auth/getUser`;
        return axiosClient(token).get(url, {});
    },
    getQuizzList: (token) => {
        const url = `/library`;
        return axiosClient(token).get(url, {});
    },
    getPin: (token, id) => {
        const url = `/host?quizId=${id}`;
        return axiosClient(token).get(url, {});
    },
    createNewQuiz: (token, data) => {
        const url = `/quiz/save`;
        return axiosClient(token).post(url, { data });
    },
    deleteQuiz: (token, id) => {
        const url = `/quiz/delete?id=${id}`;
        return axiosClient(token).post(url, {});
    },
    getQuizInfo: (token, id) => {
        const url = `/library/view?id=${id}`;
        return axiosClient(token).get(url, {});
    },
    updateQuizInfo: (token, data) => {
        const url = `/quiz/update?id=${data.uid}`;
        return axiosClient(token).post(url, { data });
    },
    markFavoriteQuiz: (token, id, value) => {
        const url = `/library/setFavorite?id=${id}&value=${value}`;
        return axiosClient(token).post(url, {});
    },
    getTheme: (token, id) => {
        const url = `/library/getTheme?id=${id}`;
        return axiosClient(token).get(url, {});
    },
    getReportList: (token, id) => {
        const url = `/library/listReport?id=${id}`;
        return axiosClient(token).get(url, {});
    },
    getReportDetail: (token, id) => {
        const url = `/library/viewReport?id=${id}`;
        return axiosClient(token).get(url, {});
    },
    // forgotPassword: (email) => {
    //     const url = `/api/auth/forgotpassword`;
    //     return axiosClient().post(url, {
    //         email,
    //     });
    // },
    // resetPassword: (password, token) => {
    //     const url = `/api/auth/resetpassword/${token}`;
    //     return axiosClient().put(url, {
    //         password,
    //     });
    // },
    // getMyProfile: (token) => {
    //     const url = `/api/myProfile/getProfile`;
    //     return axiosClient(token).get(url);
    // },
    // getFollowList: (token, cate) => {
    //     let url;
    //     if (cate === category.movie) url = `/api/myList/getList/movie`;
    //     else if (cate === category.tv) url = `/api/myList/getList/series`;
    //     return axiosClient(token).get(url);
    // },
    // addFollowItem: (token, cate, id) => {
    //     let url;
    //     if (cate === category.movie) url = `/api/myList/addListItem/movie`;
    //     else if (cate === category.tv) url = `/api/myList/addListItem/series`;
    //     return axiosClient(token).put(url, {
    //         id,
    //     });
    // },
    // removeFollowItem: (token, cate, id) => {
    //     let url;
    //     if (cate === category.movie) url = `/api/myList/deleteListItem/movie`;
    //     else if (cate === category.tv)
    //         url = `/api/myList/deleteListItem/series`;
    //     return axiosClient(token).put(url, {
    //         id,
    //     });
    // },
    // checkFollowItem: (token, cate, id) => {
    //     let url;
    //     if (cate === category.movie)
    //         url = `/api/myList/checkListItem/movie/${id}`;
    //     else if (cate === category.tv)
    //         url = `/api/myList/checkListItem/series/${id}`;
    //     return axiosClient(token).get(url);
    // },
};

export default usersApi;
