import React, {useState} from 'react';
import Button from "../components/Button.jsx";
import {Link} from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('user data:', formData);
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

                <Button styles="place-self-center">
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

export default SignIn;