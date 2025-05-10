import React, { useEffect, useState } from "react";

{/* 
    ACKNOWLEDGEMENT: Modal inspired from 
    https://github.com/Kinetiq-PLM/kinetiq-frontend/blob/Accounting/main-it/src/modules/Accounting/components/modalNotif/NotifModal.jsx
    by the work of https://github.com/IEMDomain04 
*/}

type NotifType = "success" | "error";

interface NotifProps {
    isOpen: boolean;
    onClose?: () => void;
    type?: NotifType;
    title: string;
    message: string;
}

const iconSvg: Record<NotifType, React.ReactElement> = {
    success: (
        <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={12} fill="#F05A19" /> 
            <path
                d="M8 12.5l3 3 5-5"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    error: (
        <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={12} fill="#ef4444" />
            <path
                d="M9 9l6 6M15 9l-6 6"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

const bgColors: Record<NotifType, string> = {
    success:
        "bg-orange-50/100 border-l-4 border-orange-500 text-orange-900 dark:bg-[#1E1E1E]/98 dark:border-orange-400 dark:text-orange-100",
    error:
        "bg-red-50/80 border-l-4 border-red-500 text-red-900 dark:bg-[#1E1E1E]/98 dark:border-red-400 dark:text-red-100",
};

const progressColors: Record<NotifType, string> = {
    success: "bg-orange-500 dark:bg-orange-400",
    error: "bg-red-500 dark:bg-red-400",
};

const NotifButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    children,
    className = "",
    ...props
}) => (
    <button
        className={`bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 rounded px-3 py-1 text-xs font-medium transition ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Notif: React.FC<NotifProps> = ({
    isOpen,
    onClose,
    type = "success",
    title,
    message,
}) => {
    const [showModal, setShowModal] = useState(isOpen);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setShowModal(true);

            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(() => {
                    setShowModal(false);
                    if (onClose) onClose();
                }, 300);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!showModal) return null;

    return (
        <div
            className="fixed bottom-10 right-10 z-50 flex justify-end pointer-events-none"
            aria-live="polite"
        >
            <div
                className={`
                    pointer-events-auto shadow-lg rounded-md overflow-hidden min-w-xs
                    transform transition-all duration-300
                    ${isAnimating ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
                    ${bgColors[type]}
                `}
            >
                <div className="p-4 flex items-start">
                    <div className="flex-shrink-0 mr-3">{iconSvg[type]}</div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium">{title}</h3>
                        <p className="mt-1 text-sm">{message}</p>
                        <div className="mt-3">
                            <NotifButton
                                onClick={() => {
                                    setIsAnimating(false);
                                    setTimeout(() => {
                                        setShowModal(false);
                                        if (onClose) onClose();
                                    }, 300);
                                }}
                                className="text-xs py-1 px-2"
                            >
                                Dismiss
                            </NotifButton>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-100"
                            onClick={() => {
                                setIsAnimating(false);
                                setTimeout(() => {
                                    setShowModal(false);
                                    if (onClose) onClose();
                                }, 300);
                            }}
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="bg-gray-200 dark:bg-gray-700 h-1 w-full">
                    <div
                        className={`h-1 ${progressColors[type]}`}
                        style={{
                            width: "100%",
                            animation: "notif-shrink 5s linear forwards",
                        }}
                    />
                </div>
                <style>
                    {`
                        @keyframes notif-shrink {
                            from { width: 100%; }
                            to { width: 0%; }
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Notif;