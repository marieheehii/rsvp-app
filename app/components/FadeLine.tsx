"use client"

import { useEffect, useRef, useState } from "react"

export default function FadeLine({
    children,
    animateOnLoad = false, // new prop
}: {
    children: React.ReactNode
    animateOnLoad?: boolean
}) {
    const ref = useRef<HTMLDivElement | null>(null)
    const [visible, setVisible] = useState(animateOnLoad) // start visible if animateOnLoad

    useEffect(() => {
        if (animateOnLoad) return // no need to observe

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.2 }
        )

        if (ref.current) observer.observe(ref.current)

        return () => observer.disconnect()
    }, [animateOnLoad])

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
            {children}
        </div>
    )
}