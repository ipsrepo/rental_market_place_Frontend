import {memo} from "react";
import logoUrl from '../assets/logo.svg';

const Header = ({children})=> {

    return (
        <header className="fixed top-0 z-50 w-full p-4 py-4 h-14 flex justify-center">

            <div className="flex items-center gap-2">
                <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
            </div>

            {/* Center title */}
            <h3 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-center whitespace-nowrap">
                {children}
            </h3>

            {/* Right */}
            <div className="ml-auto flex items-center">
                <button className="bg-accent text-primary p-4 px-8 m-6 rounded-4xl">Signin</button>
            </div>
        </header>
    );
};

export default memo(Header);
