import { AnimatePresence, motion } from 'framer-motion';
import SiriWave from '../../../components/SiriWave';
import { useCompletion, experimental_useObject as useObject } from 'ai/react';
import { useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import { optimizerData } from "../../../store/app/appSelector";
import AppButton from 'components/ui/app-button';
import { cn } from 'lib/utils';
import { z } from 'zod';
import PerformanceProgressBar from 'components/performance-progress-bar';

const PredictionOutputSchema = z.object({
    predictedPerformanceScore: z.number().min(0).max(100),
    website: z.string(),
    predictedMetrics: z.object({
        FCP: z.number().nonnegative(), // First Contentful Paint in seconds
        SI: z.number().nonnegative(),  // Speed Index in seconds
        TBT: z.number().nonnegative(), // Total Blocking Time in milliseconds
        LCP: z.number().nonnegative(), // Largest Contentful Paint in seconds
        CLS: z.number().nonnegative(), // Cumulative Layout Shift (unitless)
    }),
    summary: z.string(), // Summary of predicted speed gains
    significantImpactAreas: z.array(z.string()), // Areas where RapidLoad will have the most impact
});

export type PredictionOutput = z.infer<typeof PredictionOutputSchema>;


const AIDemoMessage = () => {
    const { object, submit, isLoading } = useObject({
        api: 'http://localhost:3000/api/ai/predictions/demo',
        schema: PredictionOutputSchema,
    });


    const { completion, complete, isLoading: messageLoading } = useCompletion({
        api: 'http://localhost:3000/api/ai/predictions/message',
        onResponse: (response) => {
            // Handle streaming response
        },
        onFinish: (message) => {
            // Handle completion
        },
    });


    const { settings, data,
        activeReport,
        settingsLoading,
        activeGear, revisions } = useSelector(optimizerData);

    const systemMessage = useMemo(() => {

        return `
**User Details:**

- **Website URL**: [${data?.loadingExperience?.initial_url}](${data?.loadingExperience?.initial_url})

**Google Page Speed Report Summary:**

${data?.metrics.map(metric => `- **${metric.refs.acronym}**: ${metric.displayValue}`).join('\n')}
- **Performance Score**: ${data?.performance}

**Current Page Speed Audits:**

- **Opportunities**:
${data?.grouped.opportunities.map(group => `  - **${group.name}**: ${group.displayValue}`).join('\n')}
- **Diagnostics**:
${data?.grouped.diagnostics.map(group => `  - **${group.name}**: ${group.displayValue}`).join('\n')}
- **Passed Audits**: Total of ${data?.grouped?.passed_audits.length}

**Shakeeb's Current RapidLoad Settings:**

Optimizing Device: ${activeReport}
Performance Score: ${activeGear}

`;
    }, [data, settings, activeGear]);


    // Trigger completion when component mounts
    useEffect(() => {
        // complete('Analyze page speed');
    }, []);

    return (
        <div>
            <div className="relative p-[2px] rounded-xl">
                {/* Animated border container */}

                <AnimatePresence>
                    {!isLoading && <motion.div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background: `linear-gradient(90deg, transparent 0%, transparent 25%, #6c21a8 50%, transparent 75%, transparent 100%)`,
                            backgroundSize: '200% 100%',
                        }}
                        animate={{
                            backgroundPosition: ['200% 0', '-200% 0'],
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{
                            duration: 4,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    />}
                </AnimatePresence>

                {/* Content */}
                <div className="relative bg-white/90 dark:bg-brand-930/80 rounded-xl text-sm flex flex-col items-start">
                    <div className={cn(
                        'flex items-center justify-between gap-4 px-5 py-4 w-full',
                        object && 'border-b'
                    )}>
                        <div className="flex items-center gap-4">
                            <SiriWave />

                            <div className="flex flex-col gap-0.5">
                                <span className="text-md flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(67,31,112)] to-purple-400 font-semibold">
                                    Speed Intelligence <span className="px-2 py-1 text-xxs font-medium border rounded-full">Beta</span>
                                </span>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-600"
                                >
                                    {isLoading ?
                                        'AI is analyzing your page speed to provide personalized optimization recommendations...' :
                                        'Our AI-powered speed intelligence feature is coming soon! Get ready for personalized insights.'}
                                </motion.div>
                            </div>
                        </div>
                        {/* <div>
                            <AppButton disabled={true} size="sm" onClick={() => {
                                submit(systemMessage)
                                complete(systemMessage)
                            }}>Coming Soon</AppButton>
                        </div> */}
                    </div>





                    {object &&
                        <div className="relative px-5 py-4 text-slate-700 max-w-none">
                            <div className='flex flex-col gap-6'>


                                <div className="flex flex-col gap-1">
                                    <div className='text-md font-semibold'>Speed Intelligence Maximum Performance Score Prediction</div>
                                    <div className=''>
                                        <p className='text-gray-700'>{object?.summary}</p>
                                    </div>
                                </div>


                                {/* Performance Score and Metrics */}
                                <div className='grid grid-cols-2 gap-6'>
                                    {/* Left column - Performance Score */}
                                    <div className='flex gap-4'>
                                        <div className='flex items-center gap-4'>
                                            <PerformanceProgressBar
                                                background={false}
                                                stroke={5}
                                                scoreClassName='text-[24px]'
                                                className='h-24'
                                                performance={object?.predictedPerformanceScore || 0}
                                            />
                                        </div>
                                        <div className='flex text-center'>
                                            {Object.entries(object?.predictedMetrics || {}).map(([metric, value]) => (
                                                <div key={metric} className='flex flex-col'>
                                                    <span className='text-sm text-gray-600'>{metric}</span>
                                                    <span className='text-lg font-semibold'>
                                                        {metric === 'CLS' ? value.toFixed(3) :
                                                            metric === 'TBT' ? `${value}ms` :
                                                                `${value.toFixed(1)}s`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className=''>
                                        <h3 className='text-lg font-semibold mb-2'>Significant Impact Areas</h3>
                                        <ul className='list-disc pl-5 space-y-1'>
                                            {object?.significantImpactAreas?.map((area, index) => (
                                                <li key={index} className='text-gray-700'>{area}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Summary */}


                                {/* Impact Areas */}

                            </div>
                        </div>
                    }

                    {/* {completion && <div className='relative px-5 py-4 text-slate-700 prose prose-sm max-w-none'>
                        <ReactMarkdown>{completion}</ReactMarkdown>
                    </div>
                    } */}

                    
                </div>
            </div>
        </div>
    );
};

export default AIDemoMessage;