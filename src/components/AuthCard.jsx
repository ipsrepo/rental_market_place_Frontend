import React from 'react';
import LogoUrl from "../assets/logo.svg?react";
import {Link} from "react-router-dom";

const AuthCard = ({children}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

                <h2 className="mb-2 flex justify-center">
                    <Link to="/">
                        <LogoUrl alt="Rental Marketplace" className="h-10 w-auto"/>
                    </Link>
                </h2>

                {children}
            </div>
        </div>
    );
};

export default AuthCard;