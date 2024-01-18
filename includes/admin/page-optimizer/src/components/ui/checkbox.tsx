import * as React from "react";
import * as CheckboxPrimitives from "@radix-ui/react-checkbox";
import { cn } from "lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>
    >(({ className, ...props }, ref) => (
    <CheckboxPrimitives.Root
        className={cn(
            "peer inline-flex h-[20px] w-[20px] cursor-pointer items-center rounded-md border-2 border-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 relative mr-1.5",
            className
        )}
        {...props}
        ref={ref}
    >
        <CheckboxPrimitives.Indicator className="absolute -left-0.5 transition ease-in-out delay-150">
            <CheckIcon className="h-[20px] w-[20px] text-white bg-black rounded-md dark:bg-zinc-400 dark:text-black" />
        </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
));

Checkbox.displayName = CheckboxPrimitives.Root.displayName;

export { Checkbox };
