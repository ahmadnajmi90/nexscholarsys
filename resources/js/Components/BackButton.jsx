import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

const BackButton = ({ className }) => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <Button
            variant="ghost"
            onClick={handleBack}
            className={cn("pl-0 gap-1 text-gray-700 dark:text-gray-300 text-base hover:bg-transparent group", className)}
            aria-label="Go back to previous page"
        >
            <ArrowLeft className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110" />
            <span className="transition-transform duration-200 ease-in-out group-hover:scale-110">Back</span>
        </Button>
    );
};

export default BackButton;