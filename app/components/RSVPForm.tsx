"use client";

import React from "react";
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

const RSVPForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [accompany, setAccompany] = useState<string | null>(null);
    const [attendance, setAttendance] = useState("yes");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

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
                toast.error(strings.thankYouMessage)
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
        }else{
            toast.error(strings.supabaseError)
        }


        setIsLoading(false);
    }


    const openGoogleMaps = () => {
        const encodedLocation = encodeURIComponent(strings.eventLocation);
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
            <p className="mb-6">{strings.description}</p>
            </div>
            
            <div>
                <div className=" overflow-hidden mb-6 bg-amber-100 p-2 rounded-md border border-dashed border-taupe-400
} space-y-2">
                    <p className="text-amber-400 text-center"><b>Baby Shower Date: </b>{date.toLocaleDateString()}</p>
                    <Calendar
                        mode="single"
                        selected={date}
                        className=" rounded-md overflow-hidden border w-full bg-white/70 backdrop-blur-sm mt-1 p-2"
                        defaultMonth={date}
                        onSelect={() => { }}
                        ISOWeek
                        
                    />
                </div>
                <div className="mt-4">
                    <Button type="button" variant={"outline"} className="w-full" onClick={openGoogleMaps}>
                        <MapPin />
                        {strings.viewOnMapButton}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10 mt-10">
                <div>
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
                <div>
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
                <div>
                    <Label htmlFor="accompany">{strings.accompanyLabel}</Label>
                    <Input
                        id='name'
                        type="number"
                        min="0"
                        value={accompany || ""}
                        onChange={(e) => setAccompany(e.target.value)} />
                </div>
                <div className="bg-amber-100 p-2 rounded-md border border-dashed border-taupe-400
} space-y-2">
                    <Label>{strings.rsvpLabel}</Label>
                    <RadioGroup value={attendance} onValueChange={setAttendance}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes"></RadioGroupItem>
                            <Label className="text-taupe-400" htmlFor="yes">{strings.yesOption}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no"></RadioGroupItem>
                            <Label className="text-taupe-400" htmlFor="no">{strings.noOption}</Label>
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