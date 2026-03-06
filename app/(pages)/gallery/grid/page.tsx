'use client'

import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "@/components/ui/button";
import ProtectedGallery from "../page-security";

const supabase = await createClient();

export default function GalleryPage() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch images from Supabase table
    const fetchImages = async () => {
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("created_at", { ascending: false });
        console.log(data);
        if (error) {
            console.error(error);
            return;
        }

        // Generate public URLs
        const urls = data.map((img: any) => ({
            ...img,
            url: supabase.storage.from("Honey2026Media").getPublicUrl(img.filename).data.publicUrl,
        }));
        console.log(urls);
        setImages(urls);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    // Handle file upload
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        setLoading(true);
        const file = e.target.files[0];
        const filename = `${Date.now()}_${file.name}`;

        //Storage UPl
        const { error: uploadError } = await supabase.storage
            .from("Honey2026Media")
            .upload(filename, file);

        if (uploadError) {
            console.error("Upload error:", uploadError);
            setLoading(false);
            return;
        }

        //table Upl
        const { error: dbError } = await supabase.from("gallery").insert([{ filename }]);
        if (dbError) console.error("DB insert error:", dbError);

        setLoading(false);
        e.target.value = ""; 
        fetchImages();
    };

    return (
        <ProtectedGallery>
        <div className="p-6 pt-[20vh]">
            <h1 className="text-3xl font-bold mb-4">Guest Gallery</h1>

            {/* Upload Button */}
            <div className="mb-6 ui-button rounded-md border ">
                <label className="ui-button align-center cursor-pointer">
                    {loading ? "Uploading..." : "Upload Image"}

                    <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </label>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="bg-white p-3 pb-10 shadow-xl hover:scale-105 transition rotate-[-1deg]"
                    >
                        <img
                            src={img.url}
                            className="w-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
        </ProtectedGallery>
    );
} 