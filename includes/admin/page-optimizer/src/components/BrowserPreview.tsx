import { cn } from "../lib/utils"
import { useState, useRef } from "react"
import { Maximize2, Minimize2 } from "lucide-react"

interface BrowserPreviewProps {
    url: string
    className?: string
}

const BrowserPreview = ({ children, url, className }: BrowserPreviewProps) => {
    const browserRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        setIsFullscreen(p => !p)
    }

    return (
        <div
            ref={browserRef}
            className={cn(
                "rounded-lg shadow-2xl overflow-hidden",
                isFullscreen && "fixed inset-0 z-50 rounded-none",
                className
            )}
        >
            {/* Browser Chrome/Header */}
            <div className="h-12 bg-[#2A2A2A] flex items-center px-4 gap-2">
                {/* Traffic lights */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>

                {/* URL Bar */}
                <div className="ml-4 flex-grow flex items-center justify-between">
                    <div className="bg-[#1C1C1C] rounded-md h-7 flex items-center px-3 max-w-xl">
                        <div className="w-4 h-4 rounded-full bg-[#404040]"></div>
                        <div className="ml-2 text-xs text-gray-400 truncate font-mono">
                            {url}
                        </div>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={toggleFullscreen}
                        className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-[#404040]"
                        title="Toggle fullscreen"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white w-full h-[calc(100%-3rem)]">
                <iframe
                    src={`https://demo.rapidload.io/?embed&url=${url}`}
                    className="w-full h-full border-0"
                    title="Website Preview"
                />
            </div>
        </div>
    )
}

export default BrowserPreview 