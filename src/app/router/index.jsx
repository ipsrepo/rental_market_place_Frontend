import {createBrowserRouter} from "react-router-dom";
import MainLayout from "../../layouts/MainLayout.jsx";
import Home from "../../pages/Home.jsx";
import NotFound from "../../pages/NotFound.jsx";
import Login from "../../pages/Login.jsx";
import CreateAccount from "../../pages/CreateAccount.jsx";
import ProfilePage from "../../pages/Profile/index.jsx";
import AddProperty from "../../pages/AddProperty.jsx";
import PropertyDetails from "../../pages/PropertyDetails.jsx";

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
                path: "property/:id",
                element: <PropertyDetails/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <CreateAccount/>
    }
], {
    basename: "/rental_market_place_Frontend/"
});
