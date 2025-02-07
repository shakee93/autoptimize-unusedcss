import { AnimatePresence, motion } from 'framer-motion';
// import SiriWave from '../../../components/SiriWave';
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
                <div className="relative bg-white dark:bg-brand-930/80 rounded-xl text-sm flex flex-col items-start h-[50px]">
   
                </div>
            </div>
        </div>
    );
};

export default AIDemoMessage;