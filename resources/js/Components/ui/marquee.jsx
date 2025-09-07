"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

const Marquee = ({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around [--gap:1rem]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            vertical && reverse && "animate-marquee-vertical-reverse",
            !vertical && reverse && "animate-marquee-reverse",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            vertical ? "min-h-[calc(var(--gap)*2)]" : "min-w-[calc(var(--gap)*2)]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
