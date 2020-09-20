import React, { useEffect, useState, useCallback, useMemo, useRef, useReducer } from 'react'
import { View, Text, Dimensions, LayoutAnimation, Platform, UIManager, TouchableOpacity, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { RecyclerListView, DataProvider, LayoutProvider, BaseItemAnimator } from "recyclerlistview";
import AsyncStorage from "@react-native-community/async-storage";
import { initState, reducer, TYPE } from './reducer'
import {
    ReText,
    clamp,
    onGestureEvent,
    snapPoint,
    onScrollEvent,
    timing
} from "../../libs/redash";
import { PanGestureHandler, State, FlatList, TapGestureHandler, LongPressGestureHandler } from 'react-native-gesture-handler'
let { width } = Dimensions.get("window");
const { Value, eq, set, call, onChange, block, useCode, cond, add, divide, round, diff, greaterThan, greaterOrEq, lessThan, multiply, sub, and, or, abs, lessOrEq } = Animated
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedFlatListRecyclerListView = Animated.createAnimatedComponent(RecyclerListView);
const exampleData = [...Array(200)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
        5}, ${132})`
}));
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const mapInitState = (state, init) => {
    console.info('state', state)
    return { ...state, ...init }
}

const SortableRecyclerListView = () => {
    const dic = useRef({
        data: exampleData,
        activeItem: null,
        activeIndex: null
    })
    const refListView = useRef()
    const [state, dispatch] = useReducer(reducer, initState, (state) => mapInitState(state, { data: exampleData }))
    const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => {
        return r1 !== r2;
    }).cloneWithRows(exampleData))

    const [panState, translationY, translateYOffset, absoluteY, velocityY, contentOffsetY] = useMemo(() => {
        return [
            new Value(State.UNDETERMINED),
            new Value(0),
            new Value(0),
            new Value(0),
            new Value(0),
            new Value(0),
            new Value(0)
        ]
    }, [])
    const gestureHandler = onGestureEvent({ state: panState, y: translationY, absoluteY, velocityY });

    const tron = useCallback(() => {
        const data = dic.current.data
        const indexStart = 4
        const indexEnd = 5
        const left = data.slice(0, indexStart - 1)
        const mid = data.slice(indexStart, indexEnd - 1)
        const end = data.slice(indexEnd, data.length)
        const itemTop = data[indexStart - 1]
        const itemBottom = data[indexEnd - 1]
        console.info('left,mid,itemTop', itemTop, itemBottom, left, mid, end)
        const newData = [...left, itemBottom, ...mid, itemTop, ...end]
        console.info('new Date', newData)
        dic.current.data = newData
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        setDataProvider(new DataProvider((r1, r2) => {
            return r1 !== r2;
        }).cloneWithRows(dic.current.data))
    }, [])
    const _layoutProvider = useMemo(() => {
        return new LayoutProvider(
            index => {
                return index
            },
            (type, dim) => {
                dim.width = width;
                dim.height = 100;
            }
        );
    }, [])
    const drag = useCallback(() => {
        const hoverComponent = _rowHover({
            data: dic.current.activeItem,
            activeIndex: dic.current.activeIndex
        })
        dispatch({
            type: TYPE.CHANGE_HOVER_COMPONENT,
            payload: {
                hoverComponent: hoverComponent
            }
        })
    }, [])
    const renderItem = useCallback(({ item, index }) => {
        return (
            <TouchableOpacity onLongPress={drag} onPress={tron}>
                <Animated.View style={{
                    height: 100,
                    backgroundColor: 'red',
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1
                }}>
                    <Text>{item.label}</Text>
                </Animated.View>
            </TouchableOpacity>
        )
    }, [])
    const _rowHover = useCallback(({ data, index }) => {
        if (!data) return null
        return <Animated.View style={{
            height: 100,
            backgroundColor: 'blue',
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1
        }}>
            <Text>{data.label}</Text>
        </Animated.View>
        return (
            <Item {...{ data, gestureHandler, panState }} />
        )
    }, [])
    const _rowRenderer = useCallback((type, data, index, _, nope) => {

        return <TouchableOpacity
            onLongPress={() => console.info('onLongPress')}
            onPress={tron}
            onPressIn={() => {
                console.info('DCM render', type, data, index, _, nope)
                dic.current.activeItem = data
                dic.current.activeIndex = index
            }}>
            <Animated.View style={{
                height: 100,
                backgroundColor: 'red',
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1
            }}>
                <Text>{data.label}</Text>
            </Animated.View>
        </TouchableOpacity>
        return (
            <Item {...{ data, gestureHandler, panState }} />
        )
    }, [])
    const onRelease = useCallback(() => {
        panState.setValue(State.UNDETERMINED)
        dispatch({
            type: TYPE.CHANGE_HOVER_COMPONENT,
            payload: {
                hoverComponent: false
            }
        })
    }, [])
    useCode(block([

        onChange(panState, block([
            cond(eq(panState, State.ACTIVE), [call([], drag)]),
            cond(or(
                eq(panState, State.END),
                eq(panState, State.CANCELLED),
                eq(panState, State.FAILED)
            ), [call([], onRelease)]),
        ])),
        call([translationY, panState], ([a, b]) => { console.info('translationY', a, b) })
    ]))
    const viewHover = useMemo(() => {
        console.info('state.hoverComponent', state.hoverComponent)
        return (
            <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFillObject, {
                transform: [
                    {
                        translateY: dic.current.activeIndex * 100
                    }
                ]
            }]}>
                {state.hoverComponent}
            </Animated.View>
        )
    }, [state.hoverComponent])
    return (
        <LongPressGestureHandler
            maxDist={Number.MAX_SAFE_INTEGER}
            {...gestureHandler}
        >

            <Animated.View style={{
                width: '100%',
                height: '100%'
            }}>
                <RecyclerListView
                    ref={refListView}
                    rowRenderer={_rowRenderer}
                    dataProvider={dataProvider}
                    layoutProvider={_layoutProvider}
                />
                {viewHover}
            </Animated.View>
        </LongPressGestureHandler>



    )
}
const Item = ({ gestureHandler, data, panState }) => {
    const tabRef = useRef()
    return (

        <View style={{ flexDirection: 'row', height: 100, width: '100%', borderWidth: 1 }}>

            <View style={{ flexDirection: 'row', flex: 1, }}>
                <Text>{data.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', flex: 1, borderLeftWidth: 1 }}>
                <TapGestureHandler
                    ref={tabRef}
                    maxDurationMs={5000}
                >
                    <Animated.View style={[
                        {
                            width: '100%', height: 100,
                            backgroundColor: 'red'
                        }

                    ]}>
                        <PanGestureHandler
                            waitFor={tabRef.current}
                            {...gestureHandler}>
                            <Animated.View
                                style={[
                                    {
                                        width: '100%', height: 100,
                                        backgroundColor: 'red'
                                    }

                                ]}
                            />
                        </PanGestureHandler>
                    </Animated.View>
                </TapGestureHandler>
            </View>
        </View >


    )
}
SortableRecyclerListView.propTypes = {}
SortableRecyclerListView.defaultProps = {}
export default SortableRecyclerListView
