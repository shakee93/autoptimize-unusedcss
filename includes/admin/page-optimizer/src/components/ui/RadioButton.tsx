import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "lib/utils";

const RadioButton = React.forwardRef<
    React.ElementRef<typeof RadioGroup.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
>(({ className, children, ...props }, ref) => (
    <div className="flex items-center space-x-2">
        <RadioGroup.Item
            ref={ref}
            className={cn(
                "bg-white w-[20px] h-[20px] rounded-full hover:bg-purple-750/20 border-1 focus:shadow-[0_0_0_2px] focus:shadow-black outline outline-1 outline-black/50 cursor-pointer transition-colors",
                className
            )}
            {...props}
        >
            <RadioGroup.Indicator
                className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-full after:bg-black"
            />
        </RadioGroup.Item>
        <label className="text-[15px] leading-none capitalize" htmlFor={props.id}>
            {children}
        </label>
    </div>
));

RadioButton.displayName = RadioGroup.Item.displayName;

export { RadioButton };
