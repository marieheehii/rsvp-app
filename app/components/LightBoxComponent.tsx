'use client'
import { useState, useEffect } from "react";

interface LightBoxProps {
    images: any[];
    index: number | null;
    setIndex: (index: number) => void;
    onClose: () => void;
}

export default function LightBoxComponent({ images, index, setIndex, onClose }: LightBoxProps) {
    //not sure how we would open an image that doesnt exist but better safe than sorry???
    if (index === null) return null;

    const image = images[index];

    // Swipe state
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const swipeThreshold = 50; // px

    const next = () => setIndex((index + 1) % images.length);
    const prev = () => setIndex((index - 1 + images.length) % images.length);

    const download = async () => {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = image.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [index]);

    // Lock scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.touches[0].clientX);
    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;
        const distance = touchStartX - touchEndX;
        if (distance > swipeThreshold) next();
        else if (distance < -swipeThreshold) prev();
        setTouchStartX(null);
        setTouchEndX(null);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative max-w-[90vw] max-h-[90vh] touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Exit button */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-white text-3xl hover:scale-110"
                >
                    ✕
                </button>

                {/* Desktop arrows */}
                <button
                    onClick={prev}
                    className="hidden sm:flex absolute left-[-60px] top-1/2 -translate-y-1/2 text-white text-4xl hover:scale-110 select-none"
                >
                    ←
                </button>
                <button
                    onClick={next}
                    className="hidden sm:flex absolute right-[-60px] top-1/2 -translate-y-1/2 text-white text-4xl hover:scale-110 select-none"
                >
                    →
                </button>

                {/* Image */}
                <img
                    src={image.url}
                    alt={image.filename}
                    className="max-h-[80vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
                />

                {/* Download button */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={download}
                        className="ui-button rounded-md border px-4 py-2"
                    >
                        Download Image
                    </button>
                </div>
            </div>
        </div>
    );
}