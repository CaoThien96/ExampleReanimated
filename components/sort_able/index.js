import React, { useEffect, useState, useCallback, useReducer, useMemo } from 'react'
import { View, Text, FlatList, TouchableOpacity, Dimensions, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native'
import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { initState, reducer, TYPE } from './reducer'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import {
    ReText,
    clamp,
    onGestureEvent,
    snapPoint,
    timing,
} from "../../libs/redash";
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height: heightDevices } = Dimensions.get('window')
const { Value, eq, set, call, onChange, block, useCode, cond, add } = Animated
const exampleData = [...Array(20)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
        5}, ${132})`
}));
const useInitData = () => useMemo(() => {
    return []
}, [])
const useInitCellData = ({ data, keyExtractor, heightRow }) => useMemo(() => {
    const cellData = new Map()
    data.forEach((element, index) => {
        const offsetY = new Value(index * heightRow)
        const key = keyExtractor(element, index)
        cellData.set(key, { offsetY, currentIndex: index })
    });
    return [cellData]
}, [data, heightRow])
const Index = ({
    heightRow = 100,
    keyExtractor = (item, index) => `${index}`
}) => {
    const [data, setData] = useState(exampleData)
    const [state, dispatch] = useReducer(reducer, initState)

    const [] = useInitData()
    const [panState, translationY, translateYOffset] = useMemo(() => {
        return [
            new Value(State.UNDETERMINED),
            new Value(0),
            new Value(0)
        ]
    }, [])
    const translateY = useMemo(() => {
        return add(translateYOffset, translationY)
    }, [])
    const gestureHandler = onGestureEvent({ state: panState, translationY });

    const [cellData] = useInitCellData({
        data,
        heightRow,
        keyExtractor
    })
    const onDrag = useCallback((item, index) => {
        const hoverComponent = renderItem({
            item, index, isHover: true
        })
        dispatch({
            type: TYPE.CHANGE_HOVER_COMPONENT,
            payload: {
                hoverComponent,
                item
            }
        })
    }, [])

    const tron = useCallback(() => {
        const indexStart = 4
        const indexEnd = 5
        const left = data.slice(0, indexStart - 1)
        const mid = data.slice(indexStart, indexEnd - 1)
        const end = data.slice(indexEnd, exampleData.length)
        const itemTop = data[indexStart - 1]
        const itemBottom = data[indexEnd - 1]
        const newData = [...left, itemBottom, ...mid, itemTop, ...end]
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        setData(newData)
    }, [data])
    const renderItem = useCallback(({ item, index, isHover = false }) => {
        return (
            <TouchableOpacity
                disabled={isHover}
                style={{
                    height: 100,
                    backgroundColor: index % 2 === 0 ? 'red' : 'blue',
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onLongPress={() => onDrag(item, index)}
            >
                <Text
                    style={{
                        fontWeight: "bold",
                        color: "white",
                        fontSize: 32
                    }}
                >
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    }, [])
    const renderHoverRow = useCallback(() => {
        if (!state.hoverComponent) return
        const key = keyExtractor(state.item)
        // console.info('DCM state.hoverComponent', state, key)
        const paddingTop = cellData.get(key).offsetY
        const value = add(paddingTop, translationY)
        return (
            <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFillObject, {
                paddingTop: value
            }]}>
                {!!state.hoverComponent && state.hoverComponent}
                <Animated.Code exec={block([call([value], ([a]) => {
                    console.info('DCM a', a)
                })])} />
            </Animated.View>
        )
    }, [state.hoverComponent])
    const renderList = useMemo(() => {
        return (
            <AnimatedFlatList
                scrollEnabled={!state.hoverComponent}
                renderItem={renderItem}
                data={data} />
        )
    }, [data, state.hoverComponent])
    const onRelease = useCallback(() => {
        dispatch({
            type: TYPE.CHANGE_HOVER_COMPONENT,
            payload: {
                hoverComponent: null
            }
        })
    }, [])
    useCode(block([
        cond(eq(panState, State.END), [set(translateYOffset, translateY), call([], onRelease)])
    ]), [panState])
    return (
        <PanGestureHandler {...gestureHandler}>
            <Animated.View onLayout={e => console.info('heightDevices - e.nativeEvent.layout.height', heightDevices - e.nativeEvent.layout.height)} style={{
                flex: 1,
                borderWidth: 1,
                borderColor: 'red'
            }}>
                {renderList}
                {renderHoverRow()}

            </Animated.View>

        </PanGestureHandler>
    )
}
Index.propTypes = {}
Index.defaultProps = {}
export default Index
