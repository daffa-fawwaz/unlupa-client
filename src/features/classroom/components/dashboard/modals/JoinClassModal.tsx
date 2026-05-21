import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    X,
    GraduationCap,
    Users,
    BookOpen,
    Sparkles,
} from "lucide-react";

export interface JoinClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoin: () => void;
    classPreview?: {
        title: string;
        description: string;
        teacherName: string;
        memberCount: number;
        bookCount: number;
        coverImage?: string;
    };
}

export const JoinClassModal = ({
    isOpen,
    onClose,
    onJoin,
    classPreview,
}: JoinClassModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    // Dummy data if none provided
    const data = classPreview || {
        title: "Kelas Tahsin & Tajwid Al-Quran",
        description: "Program intensif pembelajaran tahsin dan tajwid dasar hingga mahir. Cocok untuk semua kalangan yang ingin memperbaiki bacaan Al-Quran.",
        teacherName: "Ust. Fulan bin Fulan",
        memberCount: 124,
        bookCount: 3,
        coverImage: "",
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-[#1A2230] to-[#0B0E14] shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] animate-in fade-in zoom-in-95 duration-300">

                {/* Header Background */}
                <div className="relative h-32 sm:h-40 shrink-0 overflow-hidden bg-[#0A0D14]">
                    {data.coverImage ? (
                        <img
                            src={data.coverImage}
                            alt={data.title}
                            className="h-full w-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/10 to-transparent">
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/20 blur-[60px]" />
                            <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-purple-500/20 blur-[60px]" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-[#1A2230] to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-gray-300 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
                        aria-label="Tutup"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="relative px-6 pb-8 sm:px-8">
                    {/* Icon overlap */}


                    <div className="mt-4">
                        <div className="mb-4">
                            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                <Sparkles className="h-3.5 w-3.5" />
                                Preview Kelas
                            </div>
                            <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                                {data.title}
                            </h2>
                        </div>

                        <p className="mb-6 text-sm leading-relaxed text-gray-400">
                            {data.description || "Belum ada deskripsi untuk kelas ini."}
                        </p>

                        <div className="mb-8 rounded-2xl border border-white/5 bg-white/5 p-4 sm:p-5">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                                    <GraduationCap className="h-5 w-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                        Pengajar
                                    </p>
                                    <p className="text-sm font-semibold text-gray-200">
                                        {data.teacherName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 border-t border-white/5 pt-4">
                                <div className="flex flex-1 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            Siswa
                                        </p>
                                        <p className="font-black text-white">
                                            {data.memberCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-1 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                            Kitab
                                        </p>
                                        <p className="font-black text-white">
                                            {data.bookCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row">
                            <button
                                onClick={onClose}
                                className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-bold text-gray-300 transition-colors hover:bg-white/5 sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                onClick={onJoin}
                                className="w-full flex-1 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 hover:shadow-blue-500/40"
                            >
                                Gabung Kelas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};