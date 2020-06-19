import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import Cursor from "./Cursor";
import Labels from "./Label";

const { Value, max, add } = Animated;

const { width: totalWidth } = Dimensions.get("window");
const minximum = 1
const maxximum = 100
const step = 0.1
const count = ((maxximum - minximum) / step) + 1;
const width = (totalWidth - 32 - 25) / count;
const height = width;
const styles = StyleSheet.create({
    container: {
        width: totalWidth - 32,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#f1f2f6",
        overflow: 'visible'
    },
});

export default ({ minValue, maxValue, step }) => {
    const points = useMemo(() => {
        return ((maxximum - minximum) / step) + 1;
    }, [])
    const size = useMemo(() => {
        return (totalWidth - 32 - 25) / (points - 1)
    }, [])
    const x = new Value(0);
    return (
        <View style={styles.container}>

            <Cursor step={step} size={size} {...{ minValue, maxValue }} {...{ x, count: points }} />
        </View>
    );
};