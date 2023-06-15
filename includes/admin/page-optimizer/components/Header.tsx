import Image from "next/image";
import Logo from "@/public/logo.svg";
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import ThemeSwitcher from "@/components/parts/theme-switcher";


const Header = ({ url = null}: { url: string|null}) => {

    return (

        <header className='w-full p-6 flex justify-between dark:border-b-zinc-700 border-b'>
            <div className='flex gap-12 items-center'>
                <div>
                    <Image className='w-36' src={Logo} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div className='flex gap-2 dark:bg-zinc-700 bg-[#eff1f5] rounded-2xl cursor-pointer'>
                        <div className='flex flex-column gap-2 px-8 py-3 dark:bg-zinc-800 bg-white dark:border-[#212223] border rounded-2xl'>
                            <ComputerDesktopIcon className="h-6 w-6  dark:text-zinc-500 text-[#7f54b3]" /> Desktop
                        </div>
                        <div className='flex flex-column gap-2 pl-4 pr-8 py-3'>
                            <DevicePhoneMobileIcon className="h-6 w-6 dark:text-zinc-500 text-[#7f54b3]" /> Mobile
                        </div>
                    </div>

                </div>
                <div>
                    <h5 className='text-[#646464] flex gap-2 items-center dark:text-neutral-400 '>
                        {url} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </h5>
                </div>
            </div>


            <div className='flex gap-8 items-center'>
                <div>
                        <span className='dark:text-neutral-400 text-[#646464] flex gap-4 items-center font-light'>
                            Last Analyzed 2 days ago... <ArrowPathIcon className="h-6 w-6 dark:text-neutral-300 text-zinc-500" />
                        </span>
                </div>
                <div>
                    <XMarkIcon className="h-8 w-8 dark:text-zinc-300 text-zinc-600" />
                </div>
            </div>
        </header>

    )
}

export default Header