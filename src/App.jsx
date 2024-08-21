import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import AccessBox from "./components/AccessBox";

function App() {
    const [accessGranted, setAccessGranted] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {!accessGranted && (
                <AccessBox onAccessGranted={() => setAccessGranted(true)} />
            )}
            {accessGranted && (
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow flex items-center justify-center p-4">
                        <Chatbot />
                    </main>
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default App;
