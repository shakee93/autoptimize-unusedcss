
const Loading = () => {
    return (
        <div className='flex flex-col w-full gap-4 text-center'>
            <div>Running analysis</div>
            <div className='relative w-56 mx-auto h-1 bg-violet-100 overflow-hidden'>
                <div className='will-change absolute animated-element h-1 w-12 translate-x-1/2 bg-[#7F54B3]'></div>
            </div>
        </div>
    )
}

export default Loading