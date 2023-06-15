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

        <header className='w-full px-4 p-4 flex justify-between border-b'>
            <div className='flex gap-12 items-center'>
                <div>
                    <Image className='w-36' src={Logo} alt='RapidLoad - #1 to unlock breakneck page speed'/>
                </div>
                <div className='flex flex-column items-center gap-4'>
                    <div className='flex gap-2 bg-[#eff1f5] rounded-2xl cursor-pointer'>
                        <div className='flex flex-column gap-2 px-8 py-3 bg-white border rounded-2xl'>
                            <ComputerDesktopIcon className="h-6 w-6 text-gray-500" /> Desktop
                        </div>
                        <div className='flex flex-column gap-2 pl-4 pr-8 py-3'>
                            <DevicePhoneMobileIcon className="h-6 w-6 text-gray-500" /> Mobile
                        </div>
                    </div>
                    <ThemeSwitcher></ThemeSwitcher>
                </div>
                <div>
                    <h5 className='text-[#646464] flex gap-2 items-center '>
                        {url} <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-500" />
                    </h5>
                </div>
            </div>


            <div className='flex gap-8 items-center'>
                <div>
                        <span className='text-[#646464] flex gap-4 items-center font-light'>
                            Last Analyzed 2 days ago... <ArrowPathIcon className="h-6 w-6 text-gray-500" />
                        </span>
                </div>
                <div>
                    <XMarkIcon className="h-8 w-8 text-gray-600" />
                </div>
            </div>
        </header>

    )
}

export default Header