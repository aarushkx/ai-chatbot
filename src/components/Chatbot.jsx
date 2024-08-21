import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../api/apiService";
import { marked } from "marked";
import DOMPurify from "dompurify";

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const chatContainerRef = useRef(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { text: DOMPurify.sanitize(input), sender: "user" };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");
        setLoading(true);

        try {
            const botResponseText = await sendChatMessage(input);
            const botMessage = {
                text: marked(botResponseText),
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error fetching response:", error.message);
            const errorMessage = {
                text: "Oops, something went wrong. Please try again.",
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-[#CCC5B9] rounded-lg shadow-md relative">
            <div
                ref={chatContainerRef}
                className="h-80 overflow-y-auto overflow-x-hidden mb-4 custom-scrollbar"
            >
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`my-2 ${
                            msg.sender === "user" ? "text-right" : "text-left"
                        }`}
                    >
                        <div
                            className={`inline-block p-2 rounded-lg ${
                                msg.sender === "user"
                                    ? "bg-[#252422] text-white"
                                    : "bg-[#FFFCF2] text-black"
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(msg.text),
                            }}
                        ></div>
                    </div>
                ))}
                {loading && (
                    <div className="my-2 text-center text-gray-500">
                        <span className="text-[#252422]">Loading...</span>
                    </div>
                )}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                    className={`bg-[#f1efeb] flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-0 ${
                        loading ? "opacity-50" : ""
                    }`}
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    className={`bg-[#4a4845] text-white p-2 rounded-r-lg hover:bg-[#252422] focus:outline-none ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z"
                            fill="#f1efeb"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
