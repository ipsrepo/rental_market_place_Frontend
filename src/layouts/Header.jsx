import {memo} from "react";
import LogoUrl from '../assets/logo.svg?react';
import {Link} from "react-router-dom";
import Button from "../components/Button.jsx";
import {TOKEN} from "../constants/app.constant.js";

const Header = () => {

    const token = localStorage.getItem(TOKEN);

    return (
        <header className="z-50 w-full py-3 px-4 flex justify-center bg-white drop-shadow-sm">

            <Link to="/" className="flex items-center gap-2">
                <LogoUrl alt="Rental Marketplace" className="h-10 w-auto"/>
            </Link>


            {/* Right */}
            <div className="ml-auto flex items-center">

                {token ?
                    <>
                        <Link to="/signup" className="flex items-center mr-4">
                            <h4>My Favorite</h4>
                        </Link>
                        <Link to="/signin">
                            <Button>P</Button>
                        </Link>

                    </>
                    :
                    <>
                        <Link to="/signup" className="flex items-center mr-4">
                            <h4>Create Account</h4>
                        </Link>

                        <Link to="/signin">
                            <Button>Signin</Button>
                        </Link>
                    </>

                }


            </div>
        </header>
    );
};

export default memo(Header);
