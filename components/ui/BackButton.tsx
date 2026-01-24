"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";


interface BackButtonProps {
    className?: string;
    label?: string;
}

export function BackButton({ className, label = "Back" }: BackButtonProps) {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className={cn(
                "flex items-center gap-2 group",
                "text-muted-foreground hover:text-foreground",
                className
            )}
        >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>{label}</span>
        </Button>
    );
}

