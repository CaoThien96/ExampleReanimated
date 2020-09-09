export const initState = {
    hoverComponent: null
}
export const TYPE = {
    'CHANGE_HOVER_COMPONENT': 'CHANGE_HOVER_COMPONENT'
}
export function reducer(state, action) {
    switch (action.type) {
        case 'CHANGE_HOVER_COMPONENT':
            return { ...state, ...action.payload }
        default:
            return state
    }
}