"use client";

import React, { useRef } from "react";
import { toast } from "sonner"
import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { strings } from "../utils/strings";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitRSVP } from "../actions/submitRSVP";
import { downloadCalendarEvent } from "../utils/calendar/downloadCalendarEvent";
import Link from "next/link";

const RSVPForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [accompany, setAccompany] = useState<string | null>(null);
    const [attendance, setAttendance] = useState("yes");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const hiddenAddEventToCalendarRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setErrors({ name: "Name is required" });
            return;
        }
        if (!email) {
            setErrors({ email: "Email is required" });
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("accompany", accompany || "0");
        formData.append("attendance", attendance);

        setIsLoading(true);
        const result = await submitRSVP(formData);

        if (result) {
            if (result.success) {
                toast.info(strings.thankYouMessage, {
                    className: "bg-amber-200 text-black rounded-md shadow-lg"
                }
                )
                setName("");
                setEmail("");
                setAccompany(null);
                setAttendance("yes");
                setErrors({});
            } else {
                toast.error(result.message)
            }
            if (result.message) {
                if (result.message === "23505") {
                    setErrors({ email: "Email already exists" });
                }
            }
        } else {
            toast.error(strings.supabaseError)
        }


        setIsLoading(false);
    }

    const openGoogleMaps = () => {
        const encodedLocation = encodeURIComponent(strings.eventLocation ?? "");
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
            "_blank"
        );
    };

    const date = new Date(strings.eventDate)
    return (
        <div className="max-w-md mx-auto my-5">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">{strings.title}</h1>
                <p className="text-xl mb-6">{strings.description}</p>
            </div>

            <div>
                <div className="mb-6 bg-amber-100 p-4 rounded-md border border-dashed border-taupe-400 space-y-2">
                    <p className="text-amber-400 text-center">
                        <b>Baby Shower Date: </b>{date.toLocaleDateString()}
                    </p>

                    <div className="w-full min-h-[320px] max-h-[480px] overflow-auto rounded-md border bg-white/70 backdrop-blur-sm p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            defaultMonth={date}
                            onSelect={() => { }}
                            ISOWeek
                            className="w-full"
                            classNames={{
                                day_button:
                                    "[&[data-selected-single=true]]:bg-amber-400 [&[data-selected-single=true]]:text-black [&[data-selected-single=true]]:focus-visible:ring-amber-400",
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col m-1">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full ui-button !font-elite mt-2"
                        onClick={() => downloadCalendarEvent()}
                    >
                        📅 Tap to save to calendar
                    </Button>
                    <Button type="button" variant={"outline"} className="w-full ui-button  mt-2 !font-elite" onClick={openGoogleMaps}>
                        <MapPin />
                        {strings.viewOnMapButton}
                    </Button>
                    <Link className="ui-button flex items-center justify-center gap-2 text-center mt-2 w-full rounded-md border p-1 font-elite" href="https://my.babylist.com/hannah-y-registry">
                        <img src="/bear.png" alt="bear" className="w-4 h-4" />
                        Baby Registry Here
                        <img src="/bear.png" alt="bear" className="w-4 h-4" />
                    </Link>
                    <div ref={hiddenAddEventToCalendarRef} className="absolute opacity-0 pointer-events-noneen">
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 mt-10">
                <div className="rsvpformdiv">
                    <Label htmlFor="name">{strings.nameLabel}</Label>
                    <Input
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && (
                        <p className="text-red-500, text-sm mt-1">{errors.name}</p>
                    )}
                </div>
                <div className="rsvpformdiv">
                    <Label htmlFor="email">{strings.emailLabel}</Label>
                    <Input
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    {errors.email && (
                        <p className="text-red-500, text-sm mt-1">{errors.email}</p>
                    )}
                </div>
                <div className="rsvpformdiv">
                    <Label htmlFor="accompany">{strings.accompanyLabel}</Label>
                    <Input
                        id='name'
                        type="number"
                        min="0"
                        value={accompany || ""}
                        onChange={(e) => setAccompany(e.target.value)} />
                </div>
                <div className="rsvpformdiv">
                    <Label className="mb-1">{strings.rsvpLabel}</Label>
                    <RadioGroup value={attendance} onValueChange={setAttendance}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes"></RadioGroupItem>
                            <Label className="!text-taupe-600" htmlFor="yes">{strings.yesOption}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no"></RadioGroupItem>
                            <Label className="!text-taupe-600" htmlFor="no">{strings.noOption}</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Button className="ui-button" disabled={isLoading} type="submit">
                    {isLoading ? "Sending" : "SUBMIT"}
                </Button>
            </form>
        </div>
    )
}


export default RSVPForm;