import Card from "components/ui/card";
import React from "react";


const AuditSkeleton = () => {

    return <Card spreader={false}>
        <div className='w-full flex justify-between px-4 py-3 rounded-3xl text-center bg-white h-14'>
            <div className='flex gap-2 items-center'>
                <div className='bg-brand-100 w-7 h-7 rounded-full animate-pulse'></div>
                <div className='flex flex-col gap-1'>
                    <div className='flex gap-1'>
                        <div className='bg-brand-100 w-64 h-6 rounded-lg animate-pulse'></div>
                        <div className='bg-brand-100 w-12 h-6 rounded-2xl border border-brand-200/50 animate-pulse'></div>
                    </div>
                    <div className='bg-brand-100 w-52 h-2 rounded-lg'></div>
                </div>
            </div>

            <div className='flex gap-3 items-center'>

                <div className='flex gap-2'>
                    <div className='bg-brand-100 w-16 h-3 rounded-2xl'></div>
                    <div className='bg-brand-100 w-16 h-3 rounded-2xl'></div>

                </div>
                <div className='bg-brand-100 w-36 h-full rounded-2xl animate-pulse border'></div>
            </div>



        </div>
    </Card>
}

export default AuditSkeleton