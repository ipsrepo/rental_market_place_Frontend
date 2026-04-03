import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../../layouts/MainLayout.jsx";
import Home from "../../pages/Home.jsx";
import NotFound from "../../pages/NotFound.jsx";
import SignIn from "../../pages/login.jsx";
import CreateAccount from "../../pages/CreateAccount.jsx";
import ProfilePage from "../../pages/Profile/index.jsx";
import AddProperty from "../../pages/AddProperty.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Home/>
            },

            {
                path: "/profile",
                element: <ProfilePage/>
            },
            {
                path: "/addProperty",
                element: <AddProperty/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    },
    {
        path: "/login",
        element: <SignIn/>
    },
    {
        path: "/signup",
        element: <CreateAccount/>
    }
]);
