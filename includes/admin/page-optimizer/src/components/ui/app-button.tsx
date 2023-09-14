import {ReactNode, MouseEvent} from "react";
import {cn} from "lib/utils";
import {Button, buttonVariants} from "components/ui/button";
import * as React from "react";
import {VariantProps} from "class-variance-authority";
import {ChevronDown} from "lucide-react";


export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const AppButton = ({children, className, ...props}: ButtonProps) => {


    return (
        <Button className={cn(
            className,
            'flex gap-2 cursor-pointer'
        )} asChild {...props} >
            {children}
        </Button>
    )
}

export default AppButton