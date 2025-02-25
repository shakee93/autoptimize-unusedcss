import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "lib/utils";

const ToggleGroup = ToggleGroupPrimitive.Root;

const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex h-[35px] px-2 items-center dark:bg-brand-800/40 justify-center bg-white text-base leading-4 rounded focus:z-10 focus:outline-none hover:bg-purple-750/20 data-[state=on]:bg-purple-750 data-[state=on]:text-brand-100 dark:text-brand-300 dark:hover:bg-brand-600/40 dark:data-[state=on]:bg-brand-600/40",
            className
        )}
        {...props}
    >
        {children}
    </ToggleGroupPrimitive.Item>
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
