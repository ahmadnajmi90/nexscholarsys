"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ShimmerText = ({
    text = "Text Shimmer",
    className,
}) => {
    return (
        <motion.div
            className="relative overflow-hidden inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.01 }}
        >
            <motion.h1
                className={cn(
                    "font-bold bg-gradient-to-r from-[#a46ede] via-[#E91E63] to-[#a46ede] bg-[length:200%_100%] bg-clip-text text-transparent",
                    className
                )}
                animate={{
                    backgroundPosition: ["200% center", "-200% center"],
                }}
                transition={{
                    duration: 2.5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                }}
            >
                {text}
            </motion.h1>
        </motion.div>
    );
};

export default ShimmerText;
