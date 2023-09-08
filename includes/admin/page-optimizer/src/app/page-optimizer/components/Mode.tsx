import {useAppContext} from "../../../context/app";
import {ReactNode} from "react";

interface ModeRenderProps {

}
interface ModeProps {
    mode?: RapidLoadOptimizerModes
    // children: (props: ModeRenderProps ) => JSX.Element
    children: ReactNode
}
const Mode = ({ children, mode = 'normal' }: ModeProps) => {
    const { mode: _mode } = useAppContext()


    if (mode === _mode) {
        return <>{children}</>
    }

    return <></>
}

export default Mode