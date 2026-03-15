import {memo} from "react";
import logoUrl from '../assets/logo.svg';
import {Link} from "react-router-dom";
import Button from "../components/Button.jsx";

const Header = ()=> {
    return (
        <header className="z-50 w-full py-3 px-4 flex justify-center bg-white drop-shadow-sm">

                <Link to="/" className="flex items-center gap-2">
                    <img src={logoUrl}  alt="Rental Marketplace" className="h-10 w-auto" />
                </Link>



            {/* Right */}
            <div className="ml-auto flex items-center">
                <Link to="/" className="flex items-center mr-4">
                    <h4>Create Account</h4>
                </Link>

                <Link to="/test">
                    <Button>Signin</Button>
                </Link>
            </div>
        </header>
    );
};

export default memo(Header);
