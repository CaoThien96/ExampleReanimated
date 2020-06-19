import React, { Component, useCallback, PureComponent, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import Animated, { Easing } from 'react-native-reanimated';
import BoxLoading from './components/BoxLoading/BoxLoading'
import HandleLoading2 from './components/BoxLoading/HandleLoading'
const { Clock, Value, set, cond, startClock, clockRunning, timing, debug, stopClock, block, eq } = Animated
const STATE = {
    NONE: new Value(0),
    ACTIVE: new Value(1),
    DE_ACTIVE: new Value(2)

}
export const TestPanel = () => {
    const animatedValue = useMemo(() => {
        return new Value(1)
    }, [])
    const isLoading = useMemo(() => {
        return STATE.NONE
    }, [])
    const [count, setCount] = useState(0)
    useEffect(() => {
        let index = 0
        setInterval(() => {
            setCount(index++)
        }, 1 * 1000);
    }, [])
    return (
        <React.Fragment>
            <View style={styles.container}>
                <Button title='click' onPress={() => {
                    isLoading.setValue(STATE.ACTIVE)
                    setTimeout(() => {
                        isLoading.setValue(STATE.DE_ACTIVE)
                    }, 300 * 1);
                }} />
                <Button title='Render' onPress={() => {
                    setCount(5)
                }} />
                {/* <Animated.View
                    style={[styles.box, { transform: [{ translateX: this.transX }] }]}
                /> */}
                <View>
                    <BoxLoading animatedValue={animatedValue} extraData={count} renderChildren={() => {
                        return (<Text>{count}</Text>)
                    }} />
                    <BoxLoading animatedValue={animatedValue} renderChildren={() => {
                        return (<Text>{1}</Text>)
                    }} />
                    <BoxLoading animatedValue={animatedValue} renderChildren={() => {
                        return (<Text>{1}</Text>)
                    }} />
                    <Text>{count}</Text>
                </View>
            </View>
            <HandleLoading2 isLoading={isLoading} animatedValue={animatedValue} />
        </React.Fragment>
    )
}

const BOX_SIZE = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    box: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderColor: '#F5FCFF',
        alignSelf: 'center',
        backgroundColor: 'plum',
        margin: BOX_SIZE / 2,
    },
})