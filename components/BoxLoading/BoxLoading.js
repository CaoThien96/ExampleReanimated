import React, { Component, useCallback, PureComponent, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';

const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block, eq } = Animated
const BoxLoading = ({ animatedValue = new Value(1), renderChildren, extraData }) => {

    const reChildren = useCallback(() => {
        return renderChildren && renderChildren()
    }, [extraData])
    return (
        <View style={{ marginTop: 8 }}>
            {
                reChildren && reChildren()
            }
            <Animated.View style={[StyleSheet.absoluteFill, {
                backgroundColor: 'gray',
                opacity: animatedValue
            }]} />
        </View>
    )
}
export default BoxLoading
