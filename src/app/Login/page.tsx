"use client";

import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const [formType, setFormType] = useState<"login" | "signup">("login");
    const { login } = useAuth();

    const toggleForm = (type: "login" | "signup") => {
        setFormType(type);
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        console.log("Logging in with data:", data);

        try {
            const res = await fetch("http://localhost:8000/users/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const responseData = await res.json();
                console.log("Login successful:", responseData);
                if (responseData.token) {
                    login(responseData.token);
                    window.location.href = "/";
                }
            } else {
                const errorText = await res.text();
                console.error("Login failed:", res.status, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    console.error("Error details:", errorData);
                } catch (e) {
                    console.error("Could not parse error response as JSON");
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        
        console.log("Submitting data:", data);
        
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
                const responseData = await res.json();
                console.log("Signup successful:", responseData);
                window.location.href = "/Login";
            } else {
                const errorText = await res.text();
                console.error("Signup failed:", res.status, errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    console.error("Error details:", errorData);
                } catch (e) {
                    console.error("Could not parse error response as JSON");
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
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
    <div className="w-full h-auto overflow-x-hidden bg-[#171717]">
        <div className="h-20"><TopNav /></div> 
        <div className="w-full h-auto flex items-center justify-center">
            <div className="bg-[#1e1e1e] p-14 shadow-lg w-1/3 m-28">
                <div id="form-container" className="transition-all">
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
        <Footer />
        </div>
    );
}
