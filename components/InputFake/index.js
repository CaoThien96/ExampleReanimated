import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import Animated, {

} from "react-native-reanimated";

import {
    ReText,
    clamp,
    onGestureEvent,
    snapPoint,
    timing,
} from "../../libs/redash/index";
import { PanGestureHandler, State, TapGestureHandler } from "react-native-gesture-handler";
import Cursor from './Cursor'
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
function createSnapoint(listWidth) {
    const snapPoint = [
        0
    ]
    listWidth.forEach((element, key) => {
        if (key === 0) {
            snapPoint.push(element.width)
        } else {
            const newX = snapPoint[key] + element.width
            snapPoint.push(newX)
        }
    });
    return snapPoint
    console.info('DCM snapPoint', snapPoint)
}
const componentName = ({
    params,
}) => {
    const listWidth = useRef([])
    const dic = useRef()
    const [translateX, setTranslateX] = useState(0)
    const [snapPoints, setSnapoints] = useState([0])
    const [listCharater, setList] = useState(123.567.toString().split(''))

    const [isfocus, setFocus] = useState(false)
    const onLayout = useCallback((e, key) => {
        const { width } = e.nativeEvent.layout
        listWidth.current.push({ width: width - 1, key })
    }, [])
    const { state, x, velocityX } = useMemo(() => {
        return {
            state: new Value(State.UNDETERMINED),
            x: new Value(0),
            velocityX: new Value(0)
        }
    }, [])

    const gestureHandler = onGestureEvent({ state, x });
    useEffect(() => {
        setTimeout(() => {
            listWidth.current = listWidth.current.sort((a, b) => {
                if (a.key < b.key) {
                    return -1
                }
                return 1
            })
            const newSnappoint = createSnapoint(listWidth.current)
            x.setValue(newSnappoint[newSnappoint.length - 1])
            setSnapoints(newSnappoint)
        }, 1000);
    }, [])

    // console.info('DCM snappoint', refSnap.current)
    console.info('DCM snappoint state', snapPoints)
    // [
    //     "DCM snappoint state",
    //     [
    //       0,
    //       8,
    //       18,
    //       28.5,
    //       34.5,
    //       45,
    //       55.5,
    //       65
    //     ]
    //   ]
    // console.info('DCM test', test)
    // useCode(block([
    //     call([x, snapPoint(x, velocityX, snapPoints)], ([a, b]) => {
    //         console.info('DCM y', a, b)
    //     })
    // ]), [snapPoints.length])
    return (
        <View style={{
            flex: 1,
            borderWidth: 1,
            justifyContent: 'center',
            width: '100%'
        }}>
            <TextInput placeholder='Enter text' />
            <Text>{dic.current}</Text>
            <TouchableOpacity
                onPress={() => {
                    const index = dic.current
                    const tmp = listCharater.slice(0, index)
                    const tmp2 = listCharater.slice(index)
                    console.info('DCM list text', tmp, tmp2)
                    tmp.pop()
                    setList([...tmp, ...tmp2])
                    x.setValue(snapPoints[index - 1])
                }}
            >
                <Text>Xoa</Text>
            </TouchableOpacity>
            <View
                onPress={() => {
                    // setFocus(true)
                }}
                activeOpacity={1}
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    alignSelf: 'center'
                }}>
                {
                    snapPoints.length > 2 ? <Animated.Code
                        exec={block([
                            call([x, snapPoint(x, velocityX, snapPoints)], ([a, b]) => {
                                console.info('DCM y', a, b)

                                dic.current = snapPoints.findIndex(el => el === b)
                                setTranslateX(b)
                            })
                        ])}
                    /> : null
                }

                {
                    listCharater.map((el, key) => {
                        return <Text onLayout={(e) => onLayout(e, key)}>{el}</Text>
                    })
                }
                <TapGestureHandler {...gestureHandler}>
                    {/* <Animated.View
                        style={{
                            backgroundColor: 'blue',
                            height: 100,
                            width: 100,

                        }}
                    /> */}
                    <Animated.View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            borderWidth: 1,
                            borderColor: 'red',
                            paddingVertical: 8,
                            marginHorizontal: 16,
                            flexDirection: 'row',


                        }}>
                        {true && <Cursor value={translateX} />}
                    </Animated.View>
                </TapGestureHandler>
            </View>
        </View>
    )
};

export default componentName;
