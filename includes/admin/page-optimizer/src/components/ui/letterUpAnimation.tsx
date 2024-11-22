import React, { FC, forwardRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "lib/utils";

interface LettersPullUpProps {
    text: string;
    className?: string;
}

const LettersPullUp = forwardRef<HTMLDivElement, LettersPullUpProps>(
    ({ text, className = "", ...props }, ref) => {
        const splittedText = text.split("");

        const pullupVariant = {
            initial: { y: 10, opacity: 0 },
            animate: (i: number) => ({
                y: 0,
                opacity: 1,
                transition: {
                    delay: i * 0.05,
                },
            }),
        };

        const containerRef = ref || React.createRef<HTMLDivElement>();
        const isInView = useInView(containerRef, { once: true });

        return (
            <div
                {...props}
                ref={containerRef}
                className={cn("flex justify-center", className)}
            >
                {splittedText.map((char, i) => (
                    <motion.div
                        key={i}
                        variants={pullupVariant}
                        initial="initial"
                        animate={isInView ? "animate" : ""}
                        custom={i}
                        className={cn(
                            "text-sm"
                        )}
                    >
                        {char === " " ? <span>&nbsp;</span> : char}
                    </motion.div>
                ))}
            </div>
        );
    }
);

export default LettersPullUp;
