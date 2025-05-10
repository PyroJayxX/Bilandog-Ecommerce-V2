"use client";

import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Notif from "../../components/Notif";

export default function Login() {
    const [formType, setFormType] = useState<"login" | "signup">("login");
    const { login } = useAuth();
    
    // Add notification state
    const [notification, setNotification] = useState({
        isOpen: false,
        type: "error" as "success" | "error",
        title: "",
        message: ""
    });

    const toggleForm = (type: "login" | "signup") => {
        setFormType(type);
    };

    // Show notification helper
    const showNotification = (type: "success" | "error", title: string, message: string) => {
        setNotification({
            isOpen: true,
            type,
            title,
            message
        });
    };

    // Close notification helper
    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("http://localhost:8000/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                // Remove credentials: "include" as JWT doesn't need it
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const responseData = await res.json();
                // Check for access and refresh tokens instead of token
                if (responseData.access && responseData.refresh) {
                    // Pass both tokens to the login function
                    login(responseData.access, responseData.refresh);
                    
                    showNotification("success", "Login Successful", "Welcome back!");
                    
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1500);
                } else {
                    // Handle missing tokens in response
                    showNotification("error", "Login Failed", "Invalid server response");
                }
            } else {
                const errorText = await res.text();
                let errorMessage = "Login failed. Please check your credentials.";
                
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    // pass
                }
                
                showNotification("error", "Login Failed", errorMessage);
            }
        } catch {
            showNotification("error", "Connection Error", "Could not connect to the server. Please try again.");
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const res = await fetch("http://localhost:8000/users/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
    
            if (res.ok) {
                await res.json();
                showNotification("success", "Registration Successful", "Your account has been created!");
                setTimeout(() => {
                    toggleForm("login");
                }, 1500);
            } else {
                const errorText = await res.text();
                let errorMessage = "Registration failed. Please check your information.";
                
                try {
                    const errorData = JSON.parse(errorText);
                    // Handle different error formats
                    if (typeof errorData === 'object') {
                        const errorMessages = [];
                        for (const field in errorData) {
                            errorMessages.push(`${field}: ${errorData[field]}`);
                        }
                        errorMessage = errorMessages.join('\n') || errorMessage;
                    } else if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch {
                    // Use default error message if can't parse
                }
                
                showNotification("error", "Registration Failed", errorMessage);
            }
        } catch (error) {
            showNotification("error", "Connection Error", "Could not connect to the server. Please try again.");
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (formType === "login") {
            handleLoginSubmit(e);
        } else {
            handleSignupSubmit(e);
        }
    }

    return (
        <div className="w-full h-full overflow-x-hidden flex flex-col bg-[#171717]">
            <div className="h-12"><TopNav /></div> 
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="bg-[#1e1e1e] p-14 shadow-lg w-full md:w-2/3 lg:w-1/3 m-8 md:m-28">
                    <div id="form-container" className="transition-all">
                        {/* Login Form */}
                        {formType === "login" ? (
                            <form id="login-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                                <input
                                    name="username"
                                    type="username"
                                    placeholder="Username"
                                    className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                    required
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                    required
                                />
                                <button type="submit" className="bg-[#6C1814] text-white py-2 my-4 rounded hover:bg-[#d04e17]">
                                    Login
                                </button>
                                <p className="text-center text-white">
                                    {"I don't have an account. "}
                                    <span className="text-[#F05A19] cursor-pointer hover:underline" onClick={() => toggleForm("signup")}>
                                        Sign up
                                    </span>
                                </p>
                            </form>
                        ) : (
                            <form id="signup-form" onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                                {/* Sign Up Form */}
                                <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                    required
                                />
                                <input
                                name="first_name"
                                type="text"
                                placeholder="First Name"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <input
                                name="last_name"
                                type="text"
                                placeholder="Last Name"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <input
                                name="address"
                                type="text"
                                placeholder="Address"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <input
                                name="contact"
                                type="text"
                                placeholder="Contact Number"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                                required
                            />
                            <button type="submit" className="bg-[#6C1814] text-white py-2 rounded hover:bg-[#d04e17] my-1.5">
                                Sign Up
                            </button>
                            <p className="text-center text-white">
                                {"I already have an account. "}
                                <span className="text-[#F05A19] cursor-pointer hover:underline" onClick={() => toggleForm("login")} >
                                    Login
                                </span>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
        <div>
            <Notif
                isOpen={notification.isOpen}
                onClose={closeNotification}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />
        </div>
        <div>
            <Footer />
        </div>
        </div>
    );
}