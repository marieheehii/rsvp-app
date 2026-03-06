"use client"

import { useEffect, useState } from "react"

export default function DelayedFade({
    children,
    delay = 0, // delay in milliseconds
    className = "",
}: {
    children: React.ReactNode
    delay?: number
    className?: string
}) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true)
        }, delay)
        return () => clearTimeout(timer)
    }, [delay])

    return (
        <div
            className={`transition-opacity duration-1000 ease-out ${visible ? "opacity-100" : "opacity-0"
                } ${className}`}
        >
            {children}
        </div>
    )
}