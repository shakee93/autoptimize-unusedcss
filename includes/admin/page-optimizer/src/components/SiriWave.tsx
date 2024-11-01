import { motion } from 'framer-motion';

const SiriWave = () => {
    return (
        <div className="relative w-8 h-8">
            {/* Animated outer glow layers */}
            <motion.div
                className="absolute inset-[-2%] rounded-full blur-xl"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.2, 1],
                    background: [
                        'radial-gradient(circle at 30% 30%, rgba(108, 33, 168, 0.4), transparent)',
                        'radial-gradient(circle at 70% 70%, rgba(108, 33, 168, 0.4), transparent)',
                        'radial-gradient(circle at 30% 30%, rgba(108, 33, 168, 0.4), transparent)',
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Base orb with gradient */}
            <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, #9333ea, #6c21a8)',
                    boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.8), inset 2px 2px 4px rgba(255,255,255,0.8)'
                }}
            >
                {/* Deep purple core */}
                <div className="absolute inset-[0] rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 40% 40%, #6c21a8, #4a1775)'
                    }}
                />

                {/* Animated energy waves */}
                <motion.div
                    className="absolute inset-0"
                    style={{

                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Rotating energy effect */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'conic-gradient(from 0deg at 50% 50%, transparent, rgba(147, 51, 234, 0.6), transparent)',
                    }}
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Moving highlight */}
                <motion.div
                    className="absolute w-3.5 h-3.5 rounded-full blur-[1px]"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.7), transparent)',
                    }}
                    animate={{
                        top: ['20%', '45%', '20%'],
                        left: ['20%', '45%', '20%'],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Subtle rim light */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        // background: 'radial-gradient(circle at 70% 70%, transparent 50%, rgba(0,0,0,0.6) 100%)'
                    }}
                />
            </motion.div>
        </div>
    );
};

export default SiriWave; 