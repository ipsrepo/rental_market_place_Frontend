import {useState} from "react";
import {formatJoinDate} from "../../utils/date.js";

const Profile = ({user, onDeleteAccount}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const handleDelete = () => {
        if (deleteInput === 'DELETE') {
            onDeleteAccount();
            setShowDeleteModal(false);
        }
    };

    const getInitials = (name) => name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);



    return (<div className="space-y-6">

            <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-center gap-5">
                    <div
                        className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {getInitials(user.name)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-accent capitalize">{user.name}</h2>
                        <p className="text-sm mt-0.5">Member since {formatJoinDate(user.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-accent">Account details</h3>
                </div>

                <div className="divide-y divide-border">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide">Full name</p>
                            <p className="text-accent mt-0.5 font-medium">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide">Email address</p>
                            <p className="text-accent mt-0.5 font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide">Mobile number</p>
                            <p className="text-accent mt-0.5 font-medium">{user.mobile}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <h3 className="font-semibold text-red">Danger zone</h3>
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-accent">Delete account</p>
                        <p className="text-sm mt-0.5">
                            Permanently delete your account and all your data.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="ml-4 flex-shrink-0 bg-red hover:bg-red text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        Delete account
                    </button>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-accent">Delete your account?</h3>
                        <p className="text-sm mt-2">
                            This action is permanent and cannot be undone. All your listings and data will be deleted.
                        </p>
                        <p className="text-sm text-gray-700 mt-4">
                            Type <span className="font-mono font-bold text-red">DELETE</span> to confirm:
                        </p>
                        <input
                            type="text"
                            value={deleteInput}
                            onChange={(e) => setDeleteInput(e.target.value)}
                            placeholder="Type DELETE"
                            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red"
                        />
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteInput('');
                                }}
                                className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteInput !== 'DELETE'}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Yes, delete
                            </button>
                        </div>
                    </div>
                </div>)}
        </div>);
};


export default Profile;