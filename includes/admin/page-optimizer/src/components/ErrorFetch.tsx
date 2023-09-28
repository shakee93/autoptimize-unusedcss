import {ExclamationCircleIcon} from "@heroicons/react/20/solid";
import React from "react";
import {cn} from "lib/utils";


const ErrorFetch = ({ error, className }: { error: string, className?: string}) => {
   return <div className={cn(
       'flex flex-col pt-3 px-3 gap-2',
       className
   )}>
      <div className='w-fit'>
          <ExclamationCircleIcon className='w-8 fill-red-500'/>
      </div>
       <div className='flex flex-col gap-1'>
           <span className='font-medium text-md '>Oops! Something went wrong</span>
           <span className='text-sm text-brand-700'>Try to analyze the page, If this keeps happening
                                        <br/>
                                        please contact the <a target='_blank' className='text-purple-750' href='https://rapidload.zendesk.com/hc/en-us'>support</a>
                                    </span>
           <span className='text-sm text-brand-500 border-t mt-2 pt-2 mb-6'><span className='font-medium text-brand-800'>Details:</span> {error}</span>
       </div>
   </div>
}

export default ErrorFetch