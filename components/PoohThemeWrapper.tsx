"use client"

import NavBar from "@/app/components/NavBar"
import { useEffect, useState } from "react"

export default function PoohThemeWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div style={{ background: 'radial-gradient(circle at top, #cce7ff, #99d3f2, #82c7eb, #67a6c9ff)' }} className="relative min-h-screen bg-sky-200 text-amber-400 overflow-x-hidden">

            {/* PARALLAX CLOUDS */}
            <div className="pointer-events-none fixed inset-0 z-0">

                <img
                    src="/cloud1.png"
                    className="absolute top-20 -left-10 w-64 opacity-50 animate-[cloudDrift_60s_linear_infinite_alternate]"
                    style={{ transform: `translateY(${scrollY * 0.51}px)` }}
                />

                <img
                    src="/cloud3.png"
                    className="absolute top-50 left-40 w-80 opacity-40 animate-[cloudDrift_60s_linear_infinite_alternate]"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                />

                <img
                    src="/cloud2.png"
                    className="absolute top-60 right-10 w-72 opacity-50 [cloudDrift_60s_linear_infinite_alternate]"
                    style={{ transform: `translateY(${scrollY * 0.01}px)` }}
                />

                <img
                    src="/cloud3.png"
                    className="absolute top-[300px] -left-20 w-80 opacity-40 [cloudDrift_60s_linear_infinite_alternate]"
                    style={{ transform: `translateY(${scrollY * 0.03}px)` }}
                />
                <img
                    src="/cloud2.png"
                    className="absolute bottom-[10px] right-30 w-72 opacity-50 [cloudDrift_60s_linear_infinite_alternate]"
                    style={{ transform: `translateY(${scrollY * 0.02}px)` }}
                />

            </div>

            <div className="relative flex flex-col items-center px-6">
                <NavBar />
                {children}
            </div>
        </div>
    )
}