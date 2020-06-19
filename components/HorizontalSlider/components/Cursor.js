import * as React from "react";
import { StyleSheet, Text } from "react-native";
import {
  ReText,
  clamp,
  onGestureEvent,
  snapPoint,
  timing,
} from "../../../libs/redash/index";
import Animated, {

} from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const {
  Value,
  round,
  divide,
  concat,
  add,
  cond,
  eq,
  floor,
  lessThan,
  modulo,
  set,
  useCode,
  multiply,
  call,
  block
} = Animated;


const min = 1
const max = 2
function useInitValue({ size, count, x, step, minValue, callBackValue }) {
  return React.useMemo(() => {
    return {
      snapPoints: new Array(count).fill(0).map((e, i) => i * size),
      index: round(divide(x, size)),
      translationX: new Value(0),
      velocityX: new Value(0),
      state: new Value(State.UNDETERMINED),
      offset: new Value(0)
    }
  }, [])
}
export default ({ size, count, x, step, minValue, callBackValue }) => {
  const { snapPoints, index, translationX, velocityX, state, offset } = useInitValue({ size, count, x, step, minValue })
  const value = React.useMemo(() => {
    return add(offset, translationX)
  }, [])
  const translateX = React.useMemo(() => {
    return clamp(
      cond(
        eq(state, State.END),
        set(
          offset,
          timing({
            from: value,
            to: snapPoint(value, velocityX, snapPoints),
          })
        ),
        value
      ),
      0,
      (count - 1) * size
    )
  }, [])
  const gestureHandler = onGestureEvent({ state, translationX });
  useCode(
    block([
      set(x, translateX),
      call([index], ([a]) => {
        callBackValue && callBackValue(a * step + minValue)
      })
    ]),
    [x, translateX]);
  // return null
  return (

    <React.Fragment>
      <Pure>
        <PanGestureHandler {...gestureHandler}>
          <Animated.View
            style={{
              ...StyleSheet.absoluteFillObject,
              width: 25,
              height: 20,
              borderRadius: 2,
              backgroundColor: "white",
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              justifyContent: "center",
              alignItems: "center",
              top: -8,
              transform: [{ translateX: x }],
            }}
          >
            <ReText style={{ fontSize: 24 }} text={concat(add(multiply(index, 0.1), 1))} />

          </Animated.View>
        </PanGestureHandler>
      </Pure>
    </React.Fragment>
  );
};
const Pure = React.memo(({ children }) => {
  console.log('render')
  return children
}, () => true)