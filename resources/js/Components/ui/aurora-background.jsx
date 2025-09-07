"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        className,
      )}
      style={
        {
          "--aurora":
            "repeating-linear-gradient(100deg,#a46ede_10%,#E91E63_15%,#a46ede_20%,#ffffff_25%,#E91E63_30%)",
          "--white-gradient":
            "repeating-linear-gradient(100deg,#ffffff_0%,#ffffff_7%,transparent_10%,transparent_12%,#ffffff_16%)",

          "--purple": "#a46ede",
          "--pink": "#E91E63",
          "--white": "#ffffff",
          "--transparent": "transparent",
        }
      }
      {...props}
    >
      <div
        className={cn(
          `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-40 blur-[10px] filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--purple)_10%,var(--pink)_15%,var(--purple)_20%,var(--white)_25%,var(--pink)_30%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:content-[""]`,

          showRadialGradient &&
            `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
        )}
      ></div>
      {children}
    </div>
  );
};

export default AuroraBackground;
