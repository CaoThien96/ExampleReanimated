import Animated from 'react-native-reanimated'
import { PanGestureHandler, State, FlatList } from 'react-native-gesture-handler'

const { Value, eq, set, call, onChange, block, useCode, cond, add, divide, round, diff, greaterThan, greaterOrEq, lessThan, multiply, sub, and, or, abs, lessOrEq, floor } = Animated

export const DIRECTION = {
    UP: 1,
    UNDERTIMIND: 0,
    DOWN: -1
}
export const useDetectedDirectionY = ({ translationY, isMoveUp }) => {
    const preTranslationY = new Value(0)
    const nextTranslationY = new Value(0)
    return useCode(block([
        onChange(translationY, block([
            set(preTranslationY, nextTranslationY),
            set(nextTranslationY, translationY),
            cond(greaterThan(sub(nextTranslationY, preTranslationY), 0), set(isMoveUp, DIRECTION.DOWN), set(isMoveUp, DIRECTION.UP))
        ]))
    ]), [])
}
export const useReleaseTouched = ({ panState, cbRelease = () => { } }) => {
    return useCode(block([
        onChange(panState, block([
            cond(or(
                eq(panState, State.END),
                eq(panState, State.CANCELLED),
                eq(panState, State.FAILED)
            ), [call([], cbRelease)])
        ]))
    ]), [])
}
export const useLog = ({ nodes, cb }) => {
    return call(nodes, cb)
}
