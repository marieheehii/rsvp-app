'use client'
import { useState, useEffect } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { Button } from "@/components/ui/button";
import ProtectedGallery from "../page-security";
import LightBoxComponent from "@/app/components/LightBoxComponent";

const supabase = await createClient();

export default function GalleryPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

    const downloadSelected = async () => {
        const selectedImages = images.filter(img => selected.has(img.id));

        for (const img of selectedImages) {
            const response = await fetch(img.url);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = img.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };

    const toggleSelect = (id: number) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectAll = () => {
        setSelected(new Set(images.map(img => img.id)));
    };

    const clearSelection = () => {
        setSelected(new Set());
    };

    const rotations = ["rotate-[-2deg]", "rotate-[1deg]", "rotate-[-1deg]", "rotate-[2deg]"];

    return (
        <div>
            <LightBoxComponent
                images={images}
                index={lightboxIndex}
                setIndex={setLightboxIndex}
                onClose={() => setLightboxIndex(null)}
            />
            <ProtectedGallery>
                <div className="p-6 pt-[20vh]">
                    <h1 className="text-3xl font-bold mb-4 ">Guest Gallery</h1>

                    {/* Toolbar div */}
                    <div className="flex flex-wrap justify-center items-center gap-3 mb-8">

                        {/* Upload */}
                        <label className="ui-button rounded-md border cursor-pointer px-4 py-2">
                            {loading ? "Uploading..." : "Upload Images"}
                            <input type="file" className="hidden" onChange={handleUpload} />
                        </label>

                        <div className="flex flex-wrap justify-center items-center gap-3">
                            {/* Select All */}
                            <button
                                onClick={selectAll}
                                className="ui-button rounded-md border px-4 py-2 !font-elite"
                            >
                                Select All
                            </button>

                            {/* Download */}
                            <button
                                onClick={downloadSelected}
                                disabled={selected.size === 0}
                                className="ui-button rounded-md border px-4 py-2 disabled:opacity-40 !font-elite"
                            >
                                Download Selected ({selected.size})
                            </button>
                        </div>


                        {/* Clear */}
                        {selected.size > 0 && (
                            <button
                                onClick={clearSelection}
                                className="text-sm underline text-gray-500 hover:text-black"
                            >
                                Clear Selection
                            </button>
                        )}

                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {images.map((img, index) => (
                            <div
                                key={img.id}
                                className={`relative break-inside-avoid bg-white p-3 pb-10 shadow-xl hover:scale-105 transition ${rotations[img.id % rotations.length]}`}
                            >
                                <div className="w-full overflow-hidden">
                                    <img
                                        src={img.url}
                                        className="w-full h-[260px] object-cover object-center cursor-pointer"
                                        onClick={() => setLightboxIndex(index)}
                                    />
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition rounded-sm pointer-events-none"></div>

                                {/* Selection Button */}
                                <button
                                    onClick={() => toggleSelect(img.id)}
                                    className={`absolute top-2 right-2 w-7 h-7 rounded-full border flex items-center justify-center
        ${selected.has(img.id)
                                            ? "bg-amber-400 text-black"
                                            : "bg-white/80 backdrop-blur"
                                        }`}
                                >
                                    ✓
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </ProtectedGallery>
        </div>

    );
} 