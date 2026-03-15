import React from 'react';
import {SECONDARY} from "../constants/app.constant.js";

const Button = ({styles, children, type}) => {
    return (
        <button
            className={`${styles} ${type !== SECONDARY ? 'bg-primary' : 'bg-accent'} text-white p-4 px-8 m-2 rounded-4xl cursor-pointer hover:text-accent hover:opacity-85 font-semibold tracking-wide`}>
            {children}
        </button>
    );
};

export default Button;