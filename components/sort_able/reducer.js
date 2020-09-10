import { round } from "../../libs/redash"

export const initState = {
    hoverComponent: null,
    item: {},
    data: []
}
export const TYPE = {
    'CHANGE_HOVER_COMPONENT': 'CHANGE_HOVER_COMPONENT',
    'CHANGE_DATA': 'CHANGE_DATA'
}
export function reducer(state, action) {
    switch (action.type) {
        case TYPE.CHANGE_HOVER_COMPONENT:
            return { ...state, ...action.payload }
        case TYPE.CHANGE_DATA:
            return { ...state, ...action.payload }
        default:
            return state
    }
}