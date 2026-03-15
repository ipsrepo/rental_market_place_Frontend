import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../../layouts/MainLayout.jsx";
import Home from "../../pages/Home.jsx";
import NotFound from "../../pages/NotFound.jsx";

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
                path: "link1",
                element: <Home/>
            },
            {
                path: "link2",
                element: <Home/>,
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    },
]);
