import {useAppContext} from "../../../context/app";
import {ReactNode} from "react";
import useCommonDispatch from "hooks/useCommonDispatch";

interface ModeProps {
    mode?: RapidLoadOptimizerModes
    // children: (props: ModeRenderProps ) => JSX.Element
    children: ReactNode
}
const Mode = ({ children, mode = 'normal' }: ModeProps) => {
    const { mode: _mode } = useCommonDispatch()

    if (mode === _mode) {
        return <>{children}</>
    }

    return <></>
}

export default Mode