import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import { ReText, onGestureEvent, withOffset, round as reRound } from "../../libs/redash/index";

import Knob, { KNOB_SIZE } from "./Knob";
const {
    Value,
    call,
    concat,
    cond,
    diffClamp,
    divide,
    eq,
    interpolate,
    multiply,
    round,
    sub,
    useCode,
    set,
    block
} = Animated
const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width - 150;
const RULER_HEIGHT = 20;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#a9cbee",
        justifyContent: "center",
        alignItems: "center",
    },
    slider: {
        width: SLIDER_WIDTH,
        height: 8,
        justifyContent: "center",
    },
    backgroundSlider: {
        height: RULER_HEIGHT,
        backgroundColor: "white",
    },
    sides: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    left: {
        height: RULER_HEIGHT,
        width: RULER_HEIGHT,
        borderRadius: RULER_HEIGHT / 2,
        backgroundColor: 'red',
        left: -RULER_HEIGHT / 2,
    },
    right: {
        left: RULER_HEIGHT / 2,
        height: RULER_HEIGHT,
        width: RULER_HEIGHT,
        borderRadius: RULER_HEIGHT / 2,
        backgroundColor: "white",
    },
});
function getSnapointValue() { }
export default () => {
    const state = new Value(State.UNDETERMINED);
    const translationX = new Value(0);
    const gestureHandler = onGestureEvent({ state, translationX });
    const x = diffClamp(withOffset(translationX, state), 0, SLIDER_WIDTH);
    const translateX = block([x]);
    const rotate = interpolate(x, {
        inputRange: [0, SLIDER_WIDTH],
        outputRange: [0, 4 * Math.PI],
    });
    const scaleX = interpolate(x, {
        inputRange: [0, SLIDER_WIDTH],
        // https://github.com/facebook/react-native/issues/6278
        outputRange: [0.0001, 1],
    });
    const value = reRound(multiply(divide(x, SLIDER_WIDTH), 0.1), 2);
    const label = concat(value);
    useCode(
        cond(
            eq(state, State.END),
            // eslint-disable-next-line no-console
            [
               
            ],

        ),
        [state, value]
    );
    return (
        <View style={styles.container}>
            <View style={styles.slider}>

                <PanGestureHandler minDist={0} {...gestureHandler}>
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: KNOB_SIZE,
                            height: KNOB_SIZE,
                            transform: [{ translateX }],
                        }}
                    >
                        <Animated.View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                transform: [{ rotate }],
                            }}
                        >
                            <Knob {...{ state }} />
                        </Animated.View>
                    </Animated.View>
                </PanGestureHandler>
            </View>
            <ReText text={label} />
        </View>
    );
};