export interface UserType {
    balance: number,
    earningsPerTime: number,
    earningsDelayTime: number,
    earningsGetLastTime: number,
    photo: string | null
    minersEarnings: number | null
    crystals: number
}

export interface AppType {
    telegramChannel: {
        address: string,
        link: string,
    },
}

export interface DefaultStateType {
    screenPopup: null | 'loading' | 'screenLoading' | 'screenLoadingPayment'
    activeModal: null | string
    activeModalParams: null | string | number | object

    user: null | UserType
    app: null | AppType
    team: null | any
}

const defaultState: DefaultStateType = {
    screenPopup: 'screenLoading',
    activeModal: null,
    activeModalParams: null,

    user: null,
    app: null,
    team: null,
};

export type ActionType = {
    type: string
    payload: any
}

export const SET_SCREEN_POPUP = "SET_SCREEN_POPUP";
export const SET_ACTIVE_MODAL = "SET_ACTIVE_MODAL";
export const SET_ACTIVE_MODAL_PARAMS = "SET_ACTIVE_MODAL_PARAMS";

export const SET_USER = "SET_USER";
export const SET_APP = "SET_APP";

export const SET_USER_EARNINGS_GET_LAST_TIME = "SET_USER_EARNINGS_GET_LAST_TIME";
export const SET_USER_ADD_BALANCE = "SET_USER_ADD_BALANCE";

export const REDUCE_BALANCE = "REDUCE_BALANCE";
export const SET_MINER_EARNINGS = "SET_MINER_EARNINGS";

export const SET_TEAM = "SET_TEAM";

export const ADD_CRYSTALS = "ADD_CRYSTALS";
export const REDUCE_CRYSTALS = "REDUCE_CRYSTALS";

export const SET_LANG = "SET_LANG";  //Для языка

export const reducer = (state = defaultState, action: ActionType) => {
    const payload = action.payload;

    switch (action.type) {
        case SET_SCREEN_POPUP:
            return {...state, screenPopup: payload};

        case SET_ACTIVE_MODAL:
            return {...state, activeModal: payload};

        case SET_ACTIVE_MODAL_PARAMS:
            return {...state, activeModalParams: payload};

        case SET_USER:
            return {...state, user: payload};

        case SET_APP:
            return {...state, app: payload};

        case SET_USER_EARNINGS_GET_LAST_TIME:
            return {...state, user: {...state.user, earningsGetLastTime: payload}};

        case SET_USER_ADD_BALANCE:
            if (state.user === null) {
                return state;
            }

            return {...state, user: {...state.user, balance: state.user.balance + payload}};

        case REDUCE_BALANCE:
            if (state.user === null) {
                return state;
            }

            return {...state, user: {...state.user, balance: state.user.balance - payload}};

        case SET_MINER_EARNINGS:
            return {...state, user: {...state.user, minersEarnings: payload}};

        case SET_TEAM:
            return {...state, team: payload}

        case REDUCE_CRYSTALS:
            if (state.user === null) {
                return state;
            }

            return {...state, user: {...state.user, crystals: state.user.crystals - payload}};

        case ADD_CRYSTALS:
            if (state.user === null) {
                return state;
            }

            return {...state, user: {...state.user, crystals: state.user.crystals + payload}};

        default:
            return state;
    }
}

export const getDispatchObject = (type: string, payload: any) => {
    return {type, payload};
}