import * as Tooltip from '@radix-ui/react-tooltip';
import {ReactNode} from "react";


const SpeedInsights = ({ children }: { children: ReactNode}) => {


    return (
        <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div>
                        {children}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="TooltipContent" sideOffset={5}>
                        <div>
                            This is where the freaking speed insights are going to come
                        </div>
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );

}

export default SpeedInsights