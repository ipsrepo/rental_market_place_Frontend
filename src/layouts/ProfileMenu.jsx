import React, {useEffect, useRef, useState} from 'react';
import {deleteLocalStorage, getLocalStorage} from "../utils/localStorage.js";
import {TOKEN, USER} from "../constants/app.constant.js";
import {Link, useNavigate} from "react-router-dom";

const ProfileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const nav = useNavigate();
    const userDetails = getLocalStorage(USER);

    const getInitial = () => userDetails?.name?.charAt(0).toUpperCase() ?? ' ';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onLogout = () => {
        deleteLocalStorage(TOKEN);
        deleteLocalStorage(USER);
        setIsOpen(false);
        nav('/login');
    }

    return (
        <div className="relative inline-block" ref={menuRef}>
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm
                   cursor-pointer bg-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getInitial()}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-border rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-semibold capitalize text-primary">{userDetails.name}</div>
                        {userDetails.email && <div className="text-xs">{userDetails.email}</div>}
                    </div>

                    <div className="px-4 py-3 border-b border-gray-100 flex flex-col gap-2 profile-menu">
                        <Link to="/favorites">
                            <p>My Favorites</p>
                        </Link>

                        <Link to="/favorites">
                            <h4>My Properties</h4>
                        </Link>

                        <Link to="/favorites">
                            <h4>Profile</h4>
                        </Link>
                    </div>


                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;