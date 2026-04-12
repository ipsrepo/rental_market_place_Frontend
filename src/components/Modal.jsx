import React from 'react';

const Modal = ({show, onClose, children, maxWidth = 'max-w-md' }) => {
    if (!show) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={`bg-white rounded-2xl p-6 px-8 pb-4 shadow-xl w-full ${maxWidth} overflow-y-auto max-h-[92vh]`}>
                {children}
            </div>
        </div>
    );
};

export default Modal;