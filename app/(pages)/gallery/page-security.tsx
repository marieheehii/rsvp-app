'use client'

import { useState, useEffect } from "react";

const CACHE_MINUTES = 10;

export default function ProtectedGallery({ children }: { children: React.ReactNode }) {
    const [password, setPassword] = useState("");
    const [accessGranted, setAccessGranted] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("galleryAccess");

        if (!stored) return;

        const { expires } = JSON.parse(stored);

        if (Date.now() < expires) {
            setAccessGranted(true);
        } else {
            localStorage.removeItem("galleryAccess");
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password === process.env.NEXT_PUBLIC_GALLERY_PASSWORD) {
            const expires = Date.now() + CACHE_MINUTES * 60 * 1000;

            localStorage.setItem(
                "galleryAccess",
                JSON.stringify({ expires })
            );

            setAccessGranted(true);
        } else {
            alert("Wrong password");
        }
    };

    if (!accessGranted) {
        return (
            <form onSubmit={handleSubmit} className="flex flex-col items-center mt-20">
                <label className="mb-2">Enter the gallery password:</label>

                <input
                    autoFocus
                    type="password"
                    className="border rounded px-2 py-1 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-amber-200 px-4 py-2 rounded hover:bg-amber-300">
                    Submit
                </button>
            </form>
        );
    }

    return <>{children}</>;
}