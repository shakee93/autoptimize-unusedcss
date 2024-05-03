import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function TestModeNotification() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            // Adjust the threshold according to your design
            const threshold = 200; // Adjust as needed

            if (scrollTop > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ ease: "linear", duration: 0.5 }}
            className="z-[110000] w-full text-sm bg-purple-700/30 items-center text-center py-2"
        >
      <span className="font-semibold text-purple-900">
        Test Mode turned on,
      </span>{" "}
            optimizations are safely previewed without affecting your live website.
            Perfect for experimentation and fine-tuning.
        </motion.div>
    );
}

export default TestModeNotification;
