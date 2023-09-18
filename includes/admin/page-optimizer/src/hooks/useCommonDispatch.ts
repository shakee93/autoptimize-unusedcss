import {ThunkDispatch} from "redux-thunk";
import {useDispatch, useSelector} from "react-redux";
import {CommonAction, CommonState} from "../store/common/commonTypes";
import {RootState} from "../store/app/appTypes";

const useCommonDispatch = () => {

    const dispatch: ThunkDispatch<RootState, unknown, CommonAction> = useDispatch();
    const common = useSelector((state: RootState) => state.common)


    return {
        dispatch,
        common
    }
}

export default useCommonDispatch