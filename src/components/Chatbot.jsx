import React, { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "../api/apiService";
import sendIcon from "../assets/icons/send.svg";
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
                    <img src={sendIcon} alt="Send" className="w-6" />
                </button>
            </div>
        </div>
    );
}

export default Chatbot;
