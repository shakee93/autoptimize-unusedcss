import React, {useEffect, useMemo, useState} from "react";
import {Annoyed, Frown, Loader, MehIcon, Smile, SmilePlus, ThumbsDownIcon, ThumbsUpIcon} from "lucide-react";
import {cn} from "lib/utils";
import {Textarea} from "components/ui/textarea";
import Accordion from "components/accordion";
import Card from "components/ui/card";
import {Button} from "components/ui/button";
import ApiService from "../../../../services/api";
import {useToast} from "components/ui/use-toast";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import { LazyMotion, domAnimation, m } from "framer-motion"
import AppButton from "components/ui/app-button";
import ThumbUp
    from "../../../../../../../../../woocommerce/packages/woocommerce-blocks/assets/js/icons/library/thumb-up";

const Feedback = () => {

    const [activeFeedback, setActiveFeedback] = useState<string | null>(null)
    const [notes, setNotes] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const { toast } = useToast()

    const FeedbackComponents = useMemo(() => [
        {Component: Annoyed, value: 'annoyed'},
        {Component: Frown, value: 'frown'},
        {Component: MehIcon, value: 'meh'},
        {Component: Smile, value: 'smile'},
        {Component: SmilePlus, value: 'smilePlus'}
    ], []);

    const handleFeedback = async () => {

        console.log(activeFeedback);

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
            setShowFeedback(false);

        } catch (error: any) {

            toast({
                description: <div className='flex w-full gap-2 text-center'>{error.message} <XCircleIcon
                    className='w-5 text-red-600'/></div>,
            })

            setLoading(false)
        }
    }

    useEffect(() => {

        if (!activeFeedback) {
            return;
        }

        handleFeedback();

    }, [activeFeedback])


    useEffect(() => {

        setTimeout(() => {
            setShowFeedback(true)
        }, 30 * 1)
    }, [])

    if (!showFeedback) {
        return <></>;
    }

    return (
        <Card className={cn(
            'flex flex-col gap-4 px-6 py-5 xl:mb-12 bg-brand-0/70'
        )}>
            <div className='flex flex-col gap-0.5'>
                <div className='text-sm font-medium'>How was the experience?</div>
                <div className='text-xs text-brand-500'>Feedback helps us improve the product work better for you.
                </div>
            </div>

            <div className='flex gap-2'>
                <AppButton onClick={e => {

                    setActiveFeedback('good');
                }}
                           className={cn(
                               activeFeedback === 'good' && 'bg-brand-300'
                           )}
                           variant='outline'>

                    {loading && activeFeedback === 'good' ?
                        <Loader className='w-4 animate-spin'/>
                        :
                        <ThumbsUpIcon className='w-4'/>
                    }


                    Good</AppButton>
                <AppButton onClick={e => {
                    setActiveFeedback('bad');
                }}
                           className={cn(
                               activeFeedback === 'bad' && 'bg-brand-300'
                           )}
                           variant='outline'>
                    {loading && activeFeedback === 'bad' ?
                        <Loader className='w-4 animate-spin'/>
                        :
                        <ThumbsDownIcon className='w-4'/>
                    }
                    Bad</AppButton>
            </div>
        </Card>
    );
}

export default Feedback