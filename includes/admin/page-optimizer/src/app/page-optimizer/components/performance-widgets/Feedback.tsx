import React, {useMemo, useState} from "react";
import {Annoyed, Frown, MehIcon, Smile, SmilePlus} from "lucide-react";
import {cn} from "lib/utils";
import {Textarea} from "components/ui/textarea";
import {Accordion} from "components/accordion";
import Card from "components/ui/card";
import {Button} from "components/ui/button";
import ApiService from "../../../../services/api";
import api from "../../../../services/api";
import {useAppContext} from "../../../../context/app";
import {toast} from "components/ui/use-toast";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";

const Feedback = () => {

    const [activeFeedback, setActiveFeedback] = useState<string | null>(null)
    const [notes, setNotes] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const {options} = useAppContext()

    const FeedbackComponents = useMemo(() => [
        {Component: Annoyed, value: 'annoyed'},
        {Component: Frown, value: 'frown'},
        {Component: MehIcon, value: 'meh'},
        {Component: Smile, value: 'smile'},
        {Component: SmilePlus, value: 'smilePlus'}
    ], []);

    const handleFeedback = async () => {
        const api = new ApiService(options)

        try {
            setLoading(true)
            await api.post(
                'rapidload_titan_feedback'
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

    return (
        <Card className={cn(
            'flex flex-col gap-4 px-6 py-5 mb-12',
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
                                        activeFeedback === icon.value && 'text-slate-600'
                                    )}/>
                ))}
            </div>
            <div>
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
            </div>
        </Card>
    )
}

export default Feedback