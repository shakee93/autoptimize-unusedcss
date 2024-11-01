import { motion } from 'framer-motion';
import SiriWave from '../../../components/SiriWave';

const AIDemoMessage = () => {
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
                                AI is analyzing your page speed to provide personalized optimization recommendations...
                            </motion.div>
                        </div>
                    </div>


                    <div className="px-5 py-4">
                        Based on the analysis, here are some tailored insights to help boost your site’s performance effortlessly:

                        <div className="flex flex-col gap-4">
                            {/* Render-Blocking Resources */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="font-semibold text-purple-900">Render-Blocking Resources</h3>
                                <p className="text-slate-600">
                                    RapidLoad can automatically defer non-critical resources to improve loading speeds and boost key metrics like FCP and LCP, helping your visitors see content faster.
                                </p>
                            </div>

                            {/* Image Optimization */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="font-semibold text-purple-900">Image Optimization</h3>
                                <p className="text-slate-600">
                                    RapidLoad resizes, compresses, and converts images to next-gen formats automatically, saving bandwidth and ensuring your site looks sharp and loads smoothly across all devices.
                                </p>
                            </div>

                            {/* Minification and Code Cleanup */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="font-semibold text-purple-900">Minification and Code Cleanup</h3>
                                <p className="text-slate-600">
                                    Unused CSS and JavaScript can weigh down a site. RapidLoad removes this bloat and minifies code automatically, making your pages lighter and faster without manual effort.
                                </p>
                            </div>

                            {/* Modern JavaScript Delivery */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="font-semibold text-purple-900">Modern JavaScript Delivery</h3>
                                <p className="text-slate-600">
                                    By optimizing JavaScript for modern browsers, RapidLoad improves Total Blocking Time (TBT) and boosts interactivity, ensuring a smooth user experience.
                                </p>
                            </div>

                            {/* Automatic Cache Management */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="font-semibold text-purple-900">Automatic Cache Management</h3>
                                <p className="text-slate-600">
                                    RapidLoad's caching system keeps your site updated and fast, with no maintenance needed from you. Visitors always get the best possible experience.
                                </p>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-2 text-slate-700">
                                <p>These optimizations are designed to make a noticeable impact on your site's performance. Ready to put RapidLoad's recommendations into action?</p>
                                <p className="mt-2">Click "Speed Up My Site Now" to see these improvements live.</p>
                            </div>
                        </div>

                    </div>


                </div>
            </div>
        </div>
    );
};

export default AIDemoMessage;