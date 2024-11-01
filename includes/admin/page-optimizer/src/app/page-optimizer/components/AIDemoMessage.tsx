import { motion } from 'framer-motion';
import SiriWave from '../../../components/SiriWave';
import { useCompletion } from 'ai/react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const AIDemoMessage = () => {
    const { completion, complete, isLoading } = useCompletion({
        api: 'http://localhost:3000/api/ai/predictions/demo',
    });

    // Trigger completion when component mounts
    useEffect(() => {
        complete('Analyze page speed');
    }, []);

    return (
        <div>
            <div className="relative p-[2px] rounded-xl">
                {/* Animated border container */}
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                        background: `linear-gradient(90deg, transparent 0%, transparent 25%, #6c21a8 50%, transparent 75%, transparent 100%)`,
                        backgroundSize: '200% 100%',
                    }}
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        duration: 4,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                />

                {/* Content */}
                <div className="relative bg-white rounded-xl text-sm flex flex-col items-start">
                    <div className="flex items-center gap-4 border-b px-5 py-4 w-full">
                        <SiriWave />

                        <div className="flex flex-col gap-0.5">
                            <span className="text-md flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[#5b3786] to-purple-200 font-semibold">
                                Speed Intelligence <span className="px-2 py-1 text-xxs font-medium border rounded-full">Beta</span>
                            </span>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-slate-600"
                            >
                                {isLoading ?
                                    'AI is analyzing your page speed to provide personalized optimization recommendations...' :
                                    'Analysis complete'}
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-5 py-4 text-slate-700 prose prose-sm max-w-none">
                        <ReactMarkdown>
                            {completion || 'Initializing analysis...'}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDemoMessage;