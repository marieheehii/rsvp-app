"use client"

import { useEffect, useState } from "react"

export default function ParallaxClouds() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

            <img
                src="/cloud1.png"
                className="absolute top-20 left-10 w-64 opacity-70"
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            />

            <img
                src="/cloud2.png"
                className="absolute top-60 right-10 w-72 opacity-70"
                style={{ transform: `translateY(${scrollY * 0.35}px)` }}
            />

            <img
                src="/cloud3.png"
                className="absolute top-[500px] left-1/3 w-80 opacity-60"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            />

        </div>
    )
}