import ThemeSwitcher from "components/ui/theme-switcher";
import Button from "app/speed-popover/components/elements/button";
import {Redo2, SaveIcon, Undo2} from "lucide-react";
import {useOptimizerContext} from "../../../context/root";
import TooltipText from "components/ui/tooltip-text";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/outline";

interface FooterProps {
    url: string
}

const Footer = ({ url } : FooterProps) => {

    const { setShowOptimizer } = useOptimizerContext()

    return (
        <footer className='fixed flex items-center justify-between left-0 bottom-0 px-6 py-2 dark:bg-zinc-800 bg-zinc-50 border-t dark:border-zinc-600 border-zinc-300 w-full'>
           <div className='flex gap-4 items-center'>
               <TooltipText text='Switch theme'>
                   <ThemeSwitcher></ThemeSwitcher>
               </TooltipText>
               <a className='flex text-sm gap-2 items-center' rel='_blank' href={url}>
                   {url} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
               </a>
           </div>
            <div className='flex items-center gap-2'>
                <div className='flex gap-4 px-8 text-zinc-200'>
                    <TooltipText text='Undo'>
                        <Undo2 className='w-5' />
                    </TooltipText>
                    <TooltipText text='Redo'>
                        <Redo2 className='w-5' />
                    </TooltipText>
                </div>
                <Button className='text-sm'><SaveIcon className='w-5'/> Save Changes</Button>
                <Button className='text-sm' onClick={ e => setShowOptimizer(false)} dark={false}>Close</Button>
            </div>
        </footer>
    )
}

export default Footer