import React from "react";

function Footer() {
    return (
        <footer className="bg-[#4a4845] text-white p-2 text-center">
            <p className="text-sm">
                &copy; {new Date().getFullYear()} Aarush Kumar. All rights
                reserved.
            </p>
        </footer>
    );
}

export default Footer;
