import React, { Component } from 'react';
import { StyleSheet, View, Button, Dimensions } from 'react-native';
import Interactable from '../../libs/redash/Interactable';
import { clamp } from '../../libs/redash/index'
import Animated from 'react-native-reanimated';
const { cond, eq } = Animated
const { width: widthDevice } = Dimensions.get('window')
const minximum = 1
const maxximum = 10
const step = 0.1
const count = Math.ceil(((maxximum - minximum) / step) + 1);

const width = (widthDevice - 25 - 32) / count;
const snapPoint = new Array(count).fill(0).map((e, i) => {
    return {
        x: i * width
    }
})
function getInitValue(value = 0) {
    if (value < minximum) {
        return 0
    }
    return (value - minximum) * width / step
}
const { round, divide, concat, add, multiply, set } = Animated
export default class SnapTo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snapToIndex: 0,
        };
        this.translateX = new Animated.Value(getInitValue(props.value))
        this.step = new Animated.Value(0)
        this.index = clamp(concat(add(multiply(round(divide(this.translateX, width)), this.step), minximum)), minximum, maxximum)
        this.initValue = {
            x: getInitValue(props.value)
        }
        console.info('init valuye', props.value)
    }
    render() {
        console.info('size', width)
        return (
            <View style={[styles.container, { borderWidth: 1, width: '100%', backgroundColor: 'gray', height: 16 }]}>
                <Interactable.View
                    onDrag={() => {
                        console.info('Start drag')
                        this.step.setValue(step)
                    }}
                    horizontalOnly={true}
                    ref="headInstance"
                    snapPoints={snapPoint}
                    animatedValueX={this.translateX}
                    initialPosition={this.initValue}>
                    <View
                        style={{
                            width: 25,
                            height: 20,
                            backgroundColor: this.props.color || 'red',
                            borderRadius: 35,
                        }}
                    />
                </Interactable.View>
                <Animated.Code
                    exec={Animated.block([
                        cond(eq(this.step, 0), [], [set(this.props.priceValue, this.index)])
                    ])}
                >

                </Animated.Code>
            </View >
        );
    }
    onButtonPress() {
        this.refs['headInstance'].snapTo({ index: this.state.snapToIndex });
        this.setState({
            snapToIndex: (this.state.snapToIndex + 1) % 10,
        });
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    button: {
        position: 'absolute',
        left: 110,
        backgroundColor: 'yellow',
    },
});