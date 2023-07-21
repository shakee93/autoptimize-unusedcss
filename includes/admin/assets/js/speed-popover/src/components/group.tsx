import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";
import {Bug, ChevronDown, Circle} from "lucide-react";
import {useState} from "react";

const SpeedInsightGroup = ({ title, success = false, tag, items = []}: {
    title: string
    success?: boolean
    tag: string,
    items?: []
}) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div
            className="flex flex-col cursor-pointer items-center border-gray-200 border rounded-2xl bg-white">
            <div onClick={() => { setIsOpen(p => !p)}} className='select-none flex justify-between w-full items-center py-2.5 px-4'>
                <div className='flex gap-4 items-center pr-8 '>
                    <div className='text-sm'>
                        {title}
                    </div>
                        {!success ? (
                            <div
                                className='text-xs border border-red-300 bg-red-100 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <XCircleIcon className='w-5 text-red-500'/> {items.length} issues
                            </div>
                        ) : (
                            <div
                                className='text-xs border border-green-500 bg-green-50 flex gap-1 items-center pr-2 pl-1 py-0.5 rounded-full'>
                                <CheckCircleIcon className='w-5 text-green-600'/> {items.length} audits
                            </div>
                        )}
                </div>
                {items.length > 0 && (
                    <ChevronDown className='w-5' />
                )}
            </div>
            {isOpen && (
                <div className='w-full text-left flex flex-col'>
                    {items.map(i => (
                        <div className='flex text-sm items-center gap-0.5 border-t py-2 px-4' key={i}><Circle className='w-2 fill-black mr-2'/> {i}</div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SpeedInsightGroup