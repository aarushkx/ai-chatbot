import React, { useState } from "react";
import Footer from "./Footer";

function AccessBox({ onAccessGranted }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleAccess = () => {
        const accessCode = import.meta.env.VITE_CHATBOT_ACCESS_CODE;
        if (code === accessCode) {
            onAccessGranted();
        } else {
            setError("Incorrect access code. Please try again.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-[#CCC5B9] p-8 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-xl text-[#403D39] font-bold mb-4">
                        Access Restricted
                    </h2>
                    <p className="mb-4 text-[#403D39]">
                        Due to security reasons, you are only allowed to use the
                        chatbot if you have the access code.
                    </p>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAccess()}
                        className="w-full mb-4 bg-[#f1efeb] flex-grow border rounded-lg p-2 focus:outline-none focus:ring-0"
                        placeholder="Enter Access Code"
                    />
                    <button
                        onClick={handleAccess}
                        className="w-full bg-[#4a4845] text-white p-2 rounded-lg hover:bg-[#252422] focus:outline-none"
                    >
                        Submit
                    </button>
                    {error && <p className="text-red-700 mt-4">{error}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AccessBox;
