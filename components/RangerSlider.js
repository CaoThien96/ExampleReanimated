import React, { Component } from 'react';
import { View, Text, Dimensions, TextInput } from 'react-native';
import { PanGestureHandler, State, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { block } from 'react-native-reanimated';
const { width: widthDevices } = Dimensions.get('window')
const {
    set,
    cond,
    eq,
    spring,
    startClock,
    stopClock,
    clockRunning,
    defined,
    Value,
    Clock,
    event,
    call,
    add,
    sub,
    abs
} = Animated;
function calPosition(min, max, value, transition) {
    const range = max - min // 2000
    let rangeDrag = widthDevices - 48
    let percent = (value - min) / range
    return rangeDrag * percent

}
export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            value: 0
        };
        this.dragX = new Value(0);
        this.statePan = new Value(-1);
        const dragVX = new Value(0);
        this.onGestureEvent = event([
            {
                nativeEvent: {
                    translationX: this.dragX,
                    state: this.statePan
                }
            }
        ]);
        this.translateX = new Value(0)
        this.preDrag = new Value(0)
    }
    setText = this.setText.bind(this)
    setText(text) {
        this.setState({
            count: text
        })
    }
    render() {
        const transX = Animated.interpolate(this.translateX, {
            inputRange: [-1000, 0, widthDevices - 32, 10000],
            outputRange: [0, 0, widthDevices - 32 - 16, widthDevices - 32 - 16]
        })
        console.info(widthDevices - 32)
        const low = 1000
        const high = 3000
        return (
            <React.Fragment>
                <View style={{
                    flex: 1,
                    backgroundColor: 'blue',
                    width: '100%',
                    paddingVertical: 100
                }}>
                    <TextInput onChangeText={(text) => {
                        this.setState({
                            value: text
                        })
                    }} placeholder='Enter text' />
                    <TouchableOpacity onPress={() => {
                        const newPosition = calPosition(low, high, this.state.value)
                        this.translateX.setValue(newPosition)
                    }}>
                        <Text>{'Reset'}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'black', margin: 100 }}>{this.state.value}</Text>
                    <Text style={{ color: 'black', margin: 100 }}>{this.state.count}</Text>
                    <Pure renderContent={() => {
                        return (
                            <React.Fragment>
                                <PanGestureHandler
                                    onGestureEvent={this.onGestureEvent}
                                    onHandlerStateChange={this.onGestureEvent}
                                >

                                    <Animated.View style={{ backgroundColor: 'pink', width: '100%', height: 8 }}>
                                        <PanGestureHandler
                                            onGestureEvent={this.onGestureEvent}
                                            onHandlerStateChange={this.onGestureEvent}
                                        >
                                            <Animated.View style={[
                                                {
                                                    height: 16, width: 16, borderRadius: 100, backgroundColor: 'yellow',
                                                    position: 'absolute',
                                                    top: -4,

                                                },
                                                {
                                                    transform: [{ translateX: transX }]
                                                }
                                            ]} />

                                        </PanGestureHandler>

                                    </Animated.View>

                                </PanGestureHandler>
                                <Animated.Code>
                                    {() =>
                                        block([
                                            cond(eq(this.statePan, State.ACTIVE), [
                                                set(this.translateX, add(this.translateX, sub(this.dragX, this.preDrag))),
                                                set(this.preDrag, this.dragX),
                                                call([transX], ([a]) => {
                                                    console.info('DCM 111', a)
                                                    this.setText(low + Math.floor(Math.floor(a) * (high - low) / (widthDevices - 48)))
                                                })
                                            ], [
                                                set(this.preDrag, 0)
                                            ])
                                        ])
                                    }
                                </Animated.Code>
                            </React.Fragment>
                        )
                    }}>

                    </Pure>

                </View>
            </React.Fragment>
        );
    }
}
const Pure = React.memo(({ renderContent }) => {
    return renderContent()
}, () => true)