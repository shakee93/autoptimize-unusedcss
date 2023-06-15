import Card from "@/components/parts/card";
import {InformationCircleIcon, PlusCircleIcon} from "@heroicons/react/24/solid";


const Audit = ({ audit, priority = true } : { audit?: Audit, priority?: boolean }) => {

    if (!audit?.name) {
        return ;
    }

    return (
        <Card padding='py-2 px-4' cls='flex justify-between gap-2 items-center'>
            <div className='absolute left-5 text-center mt-2'>
                <span className={`border-4 inline-block w-6 h-6  rounded-full ${priority ? 'bg-zinc-200' : 'bg-white'}`}></span>
            </div>
            <div className='flex gap-2'>
                {audit.name} <InformationCircleIcon className='w-6 h-6 text-gray-200' />
            </div>
            <div>
                <button className='flex items-center gap-2 border pl-4 pr-2 py-2 text-sm rounded-xl bg-zinc-50'>
                    View Files <PlusCircleIcon className='w-6 h-6 text-zinc-900'/>
                </button>
            </div>
        </Card>
    );
}

export default Audit
