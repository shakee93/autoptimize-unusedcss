import { motion, Variants } from "framer-motion";

interface AnimatedLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    isPlaying?: boolean;
    animationType?: "moving" | "path";
}

const sizes = {
    sm: { width: 21, height: 22 },
    md: { width: 32, height: 33 },
    lg: { width: 42, height: 44 }
};

interface CirclePathProps {
    variants: Variants;
    animate: string | object;
    d: string;
    delay: number;
}

const CirclePath = ({ variants, animate, d, delay }: CirclePathProps) => (
    <motion.path
        variants={variants}
        animate={animate}
        fillRule="evenodd"
        clipRule="evenodd"
        d={d}
        fill="#7F54B3"
    />
);

interface MovingSparkleProps {
    isPlaying: boolean;
}

const MovingSparkle = ({ isPlaying }: MovingSparkleProps) => (
    <motion.path
        d="M7.53472 3.89354C6.24574 8.54946 4.58757 10.1409 0 11.4283C4.58757 12.7156 6.24574 14.3071 7.53472 18.963C8.82369 14.3071 10.4819 12.7156 15.0694 11.4283C10.4819 10.1409 8.82369 8.54946 7.53472 3.89354Z"
        fill="#7F54B3"
        className="mt-4"
        initial="initial"
        variants={{
            initial: {
                scale: 0,
                x: 0,
                y: 1,
                rotate: 50,
                opacity: 0.6
            },
            animate: {
                scale: [0, 1, 1, 0, 0],
                x: [0, 8.5, 8.5, 23, 0],
                y: [10, 6, 6, -2, 1],
                rotate: [50, 0, 0, 50, 50],
                opacity: [0.6, 1, 1, 0, 0.6],
                transition: {
                    duration: 1.5,
                    repeat: isPlaying ? Infinity : 0,
                    ease: [
                        [0.455, 0.03, 0.515, 0.955],
                        [0.645, 0.045, 0.355, 1],
                        [0.455, 0.03, 0.515, 0.955],
                        [0.645, 0.045, 0.355, 1],
                    ],
                }
            },
            paused: {
                scale: 1,
                x: 8.5,
                y: 6,
                rotate: 0,
                opacity: 0.8,
                transition: {
                    duration: 0.3,
                    ease: "easeInOut"
                }
            }
        }}
        animate={isPlaying ? "animate" : "paused"}
        style={{
            originX: 0.5,
            originY: 0.5,
        }}
    />
);

interface SparklePathProps {
    isPlaying: boolean;
}

const SparklePath = ({ isPlaying }: SparklePathProps) => {
    const pathData = "M16.0505 14.6078C15.4258 16.8094 14.6075 17.5746 12.5602 18.1981C14.6075 18.8216 15.4258 19.5868 16.0505 21.7884C16.6753 19.5868 17.4936 18.8216 19.5408 18.1981C17.4936 17.5746 16.6753 16.8094 16.0505 14.6078Z";

    return (
        <>
            {/* Sparkle outline */}
            <motion.path
                d={pathData}
                stroke="#7F54B3"
                strokeWidth="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                variants={{
                    initial: { pathLength: 0, scale: 1.6 },
                    animate: {
                        pathLength: [0, 1, 1, 1, 0],
                        opacity: [0.3, 1, 1, 1, 0.3],
                        scale: 1.6,
                        transition: {
                            duration: 2,
                            ease: "easeInOut",
                            repeat: isPlaying ? Infinity : 0,
                            times: [0, 0.3, 0.5, 0.7, 1]
                        }
                    },
                    paused: {
                        pathLength: 1,
                        opacity: 0.7,
                        scale: 1.6,
                        transition: {
                            duration: 0.3,
                            ease: "easeInOut"
                        }
                    }
                }}
                initial="initial"
                animate={isPlaying ? "animate" : "paused"}
                style={{
                    originX: 0.5,
                    originY: 0.5,
                }}
            />

            {/* Sparkle fill */}
            <motion.path
                d={pathData}
                fill="#7F54B3"
                variants={{
                    initial: { fillOpacity: 0, scale: 1.6 },
                    animate: {
                        fillOpacity: [0, 0, 1, 1, 0],
                        scale: 1.6,
                        transition: {
                            duration: 2,
                            ease: "easeInOut",
                            repeat: isPlaying ? Infinity : 0,
                            times: [0, 0.3, 0.5, 0.7, 1]
                        }
                    },
                    paused: {
                        fillOpacity: 0.5,
                        scale: 1.6,
                        transition: {
                            duration: 0.3,
                            ease: "easeInOut"
                        }
                    }
                }}
                initial="initial"
                animate={isPlaying ? "animate" : "paused"}
                style={{
                    originX: 0.5,
                    originY: 0.5,
                }}
            />
        </>
    );
};

export const AnimatedLogo = ({
    className,
    size = "lg",
    isPlaying = true,
    animationType = "moving"
}: AnimatedLogoProps) => {
    const { width, height } = sizes[size];

    // Create sequential animations for each circular path
    const createCircleVariant = (delay: number): Variants => ({
        initial: {
            opacity: 0,
            scale: 0.98
        },
        animate: {
            opacity: [0.7, 1, 0.7],
            scale: [0.98, 1, 0.98],
            transition: {
                duration: 0.8,
                ease: "easeInOut",
                repeat: isPlaying ? Infinity : 0,
                repeatType: "loop" as const,
                delay: delay,
                repeatDelay: 0.2
            }
        },
        paused: {
            opacity: 0.85,
            scale: 0.99,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    });

    const circlePaths = [
        {
            d: "M16.5961 32.763C25.3053 32.2753 32.0237 24.9601 31.5261 16.4257C31.4431 15.0439 31.1943 13.7435 30.7796 12.443L30.5307 12.6056C30.9455 13.906 31.1943 15.2878 31.1943 16.6695C31.1943 24.1473 24.9735 30.162 17.3426 30.162C17.0938 30.162 16.845 30.162 16.5961 30.162V32.763V32.763Z",
            delay: 0
        },
        {
            d: "M2.74469 26.0168C5.56479 30.0808 10.2097 32.6005 15.1863 32.763V29.9995C11.2879 29.3493 7.97017 27.6424 5.81362 24.3099L2.74469 26.0168Z",
            delay: 0.2
        },
        {
            d: "M1.33448 10.3298C-0.65618 15.0441 -0.407347 20.3273 1.99803 24.7977L5.14991 23.0095C3.57397 19.677 3.65691 15.8569 5.39874 12.6057L1.33448 10.3298Z",
            delay: 0.4
        },
        {
            d: "M15.186 0.169922C9.54583 0.820161 4.56919 4.15264 1.91498 9.02943L6.06218 11.3865C8.13579 8.37919 11.4535 6.50975 15.1031 6.26591V0.169922H15.186Z",
            delay: 0.6
        },
        {
            d: "M30.8626 6.67237C27.4619 2.36453 22.1534 -0.155146 16.6791 0.00741415V6.18469C19.6651 6.34725 22.4023 7.48516 24.5588 9.51716L30.8626 6.67237Z",
            delay: 0.8
        }
    ];

    return (
        <motion.svg
            width={width}
            height={height}
            viewBox="0 0 32 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            initial={{ opacity: 0.9 }}
            animate={isPlaying ? { opacity: [0.9, 1, 0.9] } : { opacity: 0.95 }}
            transition={{
                duration: 2,
                ease: "linear",
                repeat: isPlaying ? Infinity : 0
            }}
        >
            {/* Circle paths */}
            {circlePaths.map((path, index) => (
                <CirclePath
                    key={index}
                    variants={createCircleVariant(path.delay)}
                    animate={isPlaying ? "animate" : "paused"}
                    d={path.d}
                    delay={path.delay}
                />
            ))}

            {/* Use animation type to determine which sparkle to show */}
            {animationType === "moving" ? (
                <MovingSparkle isPlaying={isPlaying} />
            ) : (
                <SparklePath isPlaying={isPlaying} />
            )}
        </motion.svg>
    );
}; 