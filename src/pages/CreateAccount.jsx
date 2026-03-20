import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import AuthCard from '../components/AuthCard';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        if (!acceptTerms) {
            alert("Please accept the terms and conditions");
            return;
        }
        console.log('Sign up data:', formData);
        // TODO: API call for registration
    };

    return (
        <AuthCard>
            <p className="text-center mt-4 mb-8">
                Create your account
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Terms and Conditions Checkbox */}
                <label className="flex gap-2 items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span>
                        I accept the{' '}
                        <Link to="/terms">
                            Terms and Conditions
                        </Link>
                    </span>
                </label>

                <Button type="submit" styles="w-full">
                    Sign Up
                </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-6">
                Already have an account?{' '}
                <Link to="/signin">
                    Sign In
                </Link>
            </p>
        </AuthCard>
    );
};

export default CreateAccount;