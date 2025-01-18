import { useState, useEffect } from "react";

const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        // Run on initial render and on resize
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isDesktop;
};

export default useIsDesktop;
