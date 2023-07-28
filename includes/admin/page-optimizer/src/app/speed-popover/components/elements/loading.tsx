
const Loading = () => {
    return (
        <div className='absolute top-1/2 flex w-full items-center gap-4 text-center'>
            <div className='w-full flex flex-col gap-4'>
                <div>Running analysis</div>
                <div className='relative w-72 mx-auto h-1.5 bg-violet-100 overflow-hidden'>
                    <div className='will-change absolute animate-rl-loading-loop h-1.5 w-24 translate-x-1/2 bg-[#7F54B3]'></div>
                </div>
            </div>
        </div>
    )
}

export default Loading