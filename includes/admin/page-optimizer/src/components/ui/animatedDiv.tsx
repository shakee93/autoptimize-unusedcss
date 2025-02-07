import { useRef, useState, useEffect } from "react";
import { motion as m } from "framer-motion";

export default function AnimatedDiv({ 
    animate, 
    children,
    className
}: { 
    animate: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [children, animate]); // Recalculate when children or `test` changes

    return (
        <m.div
            className={className}
            initial={{ height: 115 }}
            animate={{ height: animate ? contentHeight : 115 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <div ref={contentRef}>{children}</div>
        </m.div>
    );
}
