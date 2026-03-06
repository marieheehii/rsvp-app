"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react" // hamburger & close icons
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import { HouseHeart } from "lucide-react"

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 w-full z-100 bg-sky-200/70 backdrop-blur-md shadow-sm">
            <div className="mx-auto max-w-5xl flex items-center justify-between px-2 py-4">
                <span className="font-bold text-xl">
                    <Link className="on-hover" href="/" onClick={() => setIsOpen(false)}><House></House></Link>
                </span>

                {/* Mobile Hamburger */}
                <Button
                    className="ui-button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
               </Button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="font-elite text-taupe-500 bg-sky-200/90 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
                    <Link className="hover:bg-amber-300" href="/" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link className="hover:bg-amber-300" href="/gallery/grid" onClick={() => setIsOpen(false)}>Gallery</Link>
                    <Link className="hover:bg-amber-300" href="/rsvp-form" onClick={() => setIsOpen(false)}>RSVP</Link>
                    <Link className="hover:bg-amber-300" href="/test" onClick={() => setIsOpen(false)}>Registry</Link>
                    <Link className="hover:bg-amber-300" href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </div>
            )}
        </nav>
    )
}