import React, {useState} from 'react';
import Button from "../components/Button.jsx";
import {Link, useNavigate} from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import {loginUser} from "../services/user.service";
import {setLocalStorage} from "../utils/localStorage.js";
import {SUCCESS, TOKEN, USER} from "../constants/app.constant.js";

const Login = () => {
    const [formData, setFormData] = useState({
        email: 'sam@test.com',
        password: 'sam',
    });

    const nav = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            if(res.status === SUCCESS) {
                setLocalStorage(TOKEN, res?.token ?? '');
                setLocalStorage(USER, res?.data?.user ?? '')
                nav('/')
            }
        } catch (error) {
            alert(`something went wrong ${error}`);
        }
    };

    return (
        <AuthCard>
            <p className="text-center mt-4 mb-8">
                Sign in to your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <label className="flex gap-2 items-center cursor-pointer">
                        <input type="checkbox" className=""/>
                        <span>Remember me</span>
                </label>

                <Button styles="w-full">
                    Sign In
                </Button>
            </form>

            {/* Create account Link*/}
            <p className="text-center  mt-6">
                Don't have an account?{' '}
                <Link to="/signup">
                    Create Account
                </Link>
            </p>
        </AuthCard>
    );
};

export default Login;