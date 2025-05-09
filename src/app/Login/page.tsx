"use client";

import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";
import { useState } from "react";

export default function Login() {
    const [formType, setFormType] = useState<"login" | "signup">("login");

    const toggleForm = (type: "login" | "signup") => {
        setFormType(type);
    };

    return (
    <div className="w-full h-auto overflow-x-hidden bg-[#171717]">
        <div className="h-20"><TopNav /></div> {/* Space for the fixed navbar */}
        <div className="w-full h-auto flex items-center justify-center">
            <div className="bg-[#1e1e1e] p-14 shadow-lg w-1/3 m-28">
                <div id="form-container" className="transition-all">
                    {formType === "login" ? (
                        <form id="login-form" className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
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
                        <form id="signup-form" className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
                            />
                            <input
                                type="text"
                                placeholder="Contact Number"
                                className="bg-transparent border-b border-white text-white focus:outline-none focus:border-[#F05A19] mb-2 px-2 py-1.5"
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
