import {useDispatch, useSelector} from "react-redux";
import {getDispatchObject, SET_ACTIVE_MODAL, SET_ACTIVE_MODAL_PARAMS} from "../store/reducer";

const useModal = () => {

    const selector: any = useSelector((s) => s);
    const dispatch = useDispatch();

    const activeModal = selector['activeModal'];
    const activeModalParams = selector['activeModalParams'];

    const setActiveModal = (modalId: string | null, params?: string | number | object) => {
        dispatch(getDispatchObject(SET_ACTIVE_MODAL, modalId));

        if (params) {
            dispatch(getDispatchObject(SET_ACTIVE_MODAL_PARAMS, params));
        }

        if (!params) {
            dispatch(getDispatchObject(SET_ACTIVE_MODAL_PARAMS, null));
        }
    }

    return { activeModal, setActiveModal, activeModalParams };

};

export default useModal;