import React, {useState} from 'react';
import Button from "../components/Button.jsx";
import {Link, useNavigate} from "react-router-dom";
import AuthCard from "../components/AuthCard.jsx";
import {loginUser} from "../services/user.service";
import {setLocalStorage} from "../utils/localStorage.js";
import {SUCCESS, TOKEN, USER} from "../constants/app.constant.js";
import Modal from "../components/Modal.jsx";

const Login = () => {
    const [formData, setFormData] = useState({
        email: 'sam@test.com',
        password: 'sam',
    });

    const [showErrorModel, setShowErrorModel] = useState(false)

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
        } catch (e) {
            setShowErrorModel(true);
            console.error(e);
        }
    };

    return (
        <>
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
                        <input type="checkbox" className="" checked={true}/>
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
            {/*Delete Modal*/}
            <Modal show={showErrorModel} onClose={() => setShowErrorModel(false)}>
                <div className="p-2">
                    <h3 className="text-lg font-bold text-accent">
                        <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>Check Details?</h3>

                    <p className="text-sm text-gray-600 mt-2">
                       Please check your username and password.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowErrorModel(false)}
                            className="flex-1 py-2 border border-border rounded-lg text-sm  hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
            </>
    );
};

export default Login;