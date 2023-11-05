import React, {useEffect, useMemo, useState} from "react";
import {Annoyed, Frown, MehIcon, Smile, SmilePlus} from "lucide-react";
import {cn} from "lib/utils";
import {Textarea} from "components/ui/textarea";
import Accordion from "components/accordion";
import Card from "components/ui/card";
import {Button} from "components/ui/button";
import ApiService from "../../../../services/api";
import {toast} from "components/ui/use-toast";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import { LazyMotion, domAnimation, m } from "framer-motion"

const Feedback = () => {

    const [activeFeedback, setActiveFeedback] = useState<string | null>(null)
    const [notes, setNotes] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [showFeedback, setShowFeedback] = useState(false)

    const FeedbackComponents = useMemo(() => [
        {Component: Annoyed, value: 'annoyed'},
        {Component: Frown, value: 'frown'},
        {Component: MehIcon, value: 'meh'},
        {Component: Smile, value: 'smile'},
        {Component: SmilePlus, value: 'smilePlus'}
    ], []);

    const handleFeedback = async () => {

        if (!activeFeedback) {
            return;
        }

        const api = new ApiService();

        try {
            setLoading(true)
            await api.post(
                'rapidload_titan_feedback',
                {
                    smiley: activeFeedback,
                    detail: notes
                }
            )

            toast({
                description: <div className='flex w-full gap-2 text-center'>Thank you! Your feedback is
                    sent. <CheckCircleIcon className='w-5 text-green-600'/></div>,
            })

            setLoading(false)
            setActiveFeedback('')
            setNotes('')

        } catch (error: any) {

            toast({
                description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon
                    className='w-5 text-red-600'/></div>,
            })

            setLoading(false)
        }
    }


    useEffect(() => {

        setTimeout(() => {
            setShowFeedback(true)
        }, 30 * 1000)
    }, [])

    if (!showFeedback) {
        return <></>;
    }

    return (
        <Card className={cn(
            'flex flex-col gap-4 px-6 py-5 xl:mb-12 backdrop-blur-md bg-brand-0/70',
            !activeFeedback && 'pb-1'
        )}>
            <div className='flex flex-col gap-0.5'>
                <div className='text-sm font-medium'>Your Voice Matters</div>
                <div className='text-xs text-brand-500'>Feedback helps us enhance and tailor the product just for you.
                </div>
            </div>

            <div className='flex justify-start gap-4 select-none'>
                {FeedbackComponents.map((icon, index) => (
                    <icon.Component key={index}
                                    onClick={e =>
                                        setActiveFeedback(p => (icon.value !== p) ? icon.value : null)}
                                    className={cn(
                                        'w-8 h-8 cursor-pointer text-brand-400 hover:text-brand-500',
                                        activeFeedback === icon.value && 'text-brand-600 dark:text-brand-200'
                                    )}/>
                ))}
            </div>
            <div>
                <LazyMotion features={domAnimation}>
                    <Accordion isOpen={!!activeFeedback}>
                        <div className='flex flex-col gap-2'>
                            <Textarea value={notes} onChange={e => setNotes(e.target.value)}
                                      placeholder='Optional: Tell us more about your experience...'/>
                            <div className='flex justify-end'>
                                <Button disabled={loading} className={cn(
                                    'flex gap-1.5 pl-4',
                                    loading && 'pl-2.5'
                                )} loading={loading} onClick={e => handleFeedback()}>Submit</Button>
                            </div>
                        </div>
                    </Accordion>
                </LazyMotion>
            </div>
        </Card>
    );
}

export default Feedback