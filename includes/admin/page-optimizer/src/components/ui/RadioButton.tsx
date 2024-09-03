import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "lib/utils";

const RadioButton = React.forwardRef<
    React.ElementRef<typeof RadioGroup.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroup.Item>
>(({ className, ...props }, ref) => (
    <RadioGroup.Item
        className={cn(
            "peer inline-flex h-[20px] w-[20px] cursor-pointer items-center rounded-full border-2 border-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative mr-1.5",
            className
        )}
        {...props}
        ref={ref}
    >
        <RadioGroup.Indicator className="absolute inset-0 flex items-center justify-center">
            <div className="h-[12px] w-[12px] bg-black rounded-full dark:bg-zinc-400" />
        </RadioGroup.Indicator>
    </RadioGroup.Item>
));

RadioButton.displayName = RadioGroup.Item.displayName;

export { RadioButton };
