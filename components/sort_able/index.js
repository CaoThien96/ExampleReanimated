import React, { useEffect, useState, useCallback, useReducer, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, LayoutAnimation, UIManager, Platform, Animated as AnimatedV1 } from 'react-native'
import Animated from 'react-native-reanimated'
import PropTypes from 'prop-types'
import { initState, reducer, TYPE } from './reducer'
import { PanGestureHandler, State, FlatList } from 'react-native-gesture-handler'
import { DIRECTION } from './AnimatedHandle'
import {
    ReText,
    clamp,
    onGestureEvent,
    snapPoint,
    onScrollEvent,
    timing
} from "../../libs/redash";
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const ITEM_HEIGHT = 100
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height: heightDevices } = Dimensions.get('window')
const { Value, eq, set, call, onChange, block, useCode, cond, add, divide, round, diff, greaterThan, greaterOrEq, lessThan, multiply, sub, and, or, abs, lessOrEq } = Animated
const Alpha = ['A', 'B', 'C', 'D', 'E']
const exampleData = [...Array(15)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
        5}, ${132})`
}));
const useInitData = () => useMemo(() => {
    return [
        new Value(-1),
        new Value(-1)
    ]
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
const mapInitState = (state, init) => {
    console.info('state', state)
    return { ...state, ...init }
}
const Item = React.memo(({ item, index, isHover = false, onDrag, isActive, translateY }) => {
    console.info('render isActive', isActive, item.key)
    const top = 100 * index + 100 / 2
    return (
        <TouchableOpacity
            disabled={isHover}
            onLongPress={() => onDrag(item, index)}
        >
            <Animated.View style={{
                height: 100,
                backgroundColor: index % 2 === 0 ? 'red' : 'blue',
                alignItems: "center",
                justifyContent: "center",
                opacity: isActive ? 0 : 1,
                transform: [
                    {
                        // translateY: AnimatedV1.multiply(TestValue, -1).interpolate({
                        //     inputRange: [-top, -(top - 50)],
                        //     outputRange: [0, 100],
                        //     extrapolate: 'clamp'
                        // })
                        translateY: Animated.interpolate(multiply(translateY, -1), {
                            inputRange: [-top, -(top - 50)],
                            outputRange: [0, 100],
                            extrapolate: Animated.Extrapolate.CLAMP
                        })
                    }
                ]
            }}>
                <Text
                    style={{
                        fontWeight: "bold",
                        color: "white",
                        fontSize: 32,
                    }}
                >
                    {item.label}
                </Text>
            </Animated.View>
        </TouchableOpacity>
    )
}, (pre, next) => {
    return pre.isActive === next.isActive
})
const useListenerDirectionMove = (velocityY) => {
    return useMemo(() => {
        return block([
            cond(lessThan(velocityY, 0), DIRECTION.UP, cond(greaterThan(velocityY, 0), DIRECTION.DOWN, DIRECTION.UNDERTIMIND))
        ])
    }, [])
}
function extraData({ data = [], viewableItems = [] }) {
    console.info('DCM data viewableItems', data, viewableItems)
    const startItem = viewableItems[0]
    const endItem = viewableItems[viewableItems.length - 1]
    console.info('DCM startItem endItem', startItem, endItem)
    const leftData = data.slice(0, startItem.index)
    const rightData = data.slice(endItem.index + 1, data.length)
    console.info('DCM ', leftData, viewableItems, rightData)
    return { leftData, rightData }
}
const Index = ({
    heightRow = 100,
    keyExtractor = (item, index) => `${index}`
}) => {
    const [state, dispatch] = useReducer(reducer, initState, (state) => mapInitState(state, { data: exampleData }))
    const dic = useRef({
        data: exampleData,
        viewableItems: []
    })
    const [activeIndex, hoverIndex] = useInitData()
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
    const isMoveUp = useListenerDirectionMove(velocityY)
    const translateY = useMemo(() => {
        return new Value(0)
    }, [])
    const gestureHandler = onGestureEvent({ state: panState, translationY, absoluteY, velocityY });
    const scrollEvent = onScrollEvent({ y: contentOffsetY })
    const [cellData] = useInitCellData({
        data: state.data,
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

    const tron = useCallback(({ indexStart = 4, indexEnd = 5 }) => {
        return
        const { leftData, rightData } = extraData({ data: dic.current.data, viewableItems: dic.current.viewableItems })
        const data = dic.current.data
        const left = data.slice(0, indexStart)
        const mid = data.slice(indexStart, indexEnd - 1)
        const end = data.slice(indexEnd + 1, data.length)
        const itemTop = data[indexStart]
        const itemBottom = data[indexEnd]
        let newData = [...left, itemBottom, ...mid, itemTop, ...end]
        console.info('newData,itemBottom,itemTop', newData, itemBottom, itemTop, leftData, rightData)
        newData = [...leftData, ...newData, ...rightData]
        LayoutAnimation.create(
            200,
            LayoutAnimation.Types.linear,
            LayoutAnimation.Properties.opacity
        )
        dic.current.data = newData,
            console.info('DCM tron left,mid,end', newData)
        dispatch({
            type: TYPE.CHANGE_DATA,
            payload: {
                data: newData
            }
        })
    }, [])
    const renderItem = useCallback(({ item, index, isHover = false }) => {
        return (
            <Item
                {...{ item, index, isHover, onDrag, state, isActive: item.key === state.item.key, translateY }}
            />
        )
    }, [state.item.key])
    const renderHoverRow = useCallback(() => {
        if (!state.hoverComponent) return
        const key = keyExtractor(state.item)
        // console.info('DCM state.hoverComponent', state, key)
        const paddingTop = cellData.get(key).offsetY

        const value = add(sub(paddingTop, contentOffsetY), translationY)
        const indexHover = round(divide(paddingTop, 100))
        const triggerValue = block(
            cond(
                eq(isMoveUp, new Value(1)),
                add(ITEM_HEIGHT / 2, multiply(ITEM_HEIGHT, sub(activeIndex, 1))),
                cond(eq(isMoveUp, new Value(-1)), add(ITEM_HEIGHT / 2, multiply(ITEM_HEIGHT, add(activeIndex, 1))))
            )
        )
        return (
            <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFillObject, {
                paddingTop: value
            }]}>
                {!!state.hoverComponent && state.hoverComponent}
                <Animated.Code exec={block([
                    set(
                        activeIndex,
                        round(
                            divide(
                                value, 100
                            )
                        )
                    ),
                    set(translateY, value)
                ])} />
                <Animated.Code exec={block([
                    onChange(activeIndex, block([
                        cond(greaterThan(activeIndex, 0), [
                            call([activeIndex, value], ([a, b, c, d]) => {
                                // console.info('DCM active', a)
                            }),
                        ])
                    ])),
                    // call([
                    //     add(value, 100),
                    //     triggerValue,
                    //     isMoveUp,
                    //     activeIndex,
                    //     hoverIndex,
                    //     sub(paddingTop, contentOffsetY)
                    // ], ([a, b, c, d, e, g]) => {
                    //     // console.info('add(value, 100) trigger ValueisMoveUp activeIndex', g)
                    // }),
                    // call([
                    //     paddingTop, contentOffsetY, value, sub(paddingTop, contentOffsetY)
                    // ], ([a, b, c, d]) => {
                    //     console.info('add(value, 100) trigger ValueisMoveUp activeIndex', a, b, c)
                    // }),
                    cond(or(
                        and(
                            lessOrEq(
                                value,
                                triggerValue
                            ),
                            eq(isMoveUp, DIRECTION.UP),
                            greaterOrEq(activeIndex, 0)
                        ),
                        and(
                            greaterOrEq(
                                add(value, 100),
                                triggerValue
                            ),
                            eq(isMoveUp, DIRECTION.DOWN),
                            greaterOrEq(activeIndex, 0)
                        )
                    ), [
                        call([activeIndex], ([a]) => {
                            // console.info('set activeIndex', a)
                        }),
                        set(hoverIndex, cond(eq(isMoveUp, DIRECTION.UP), sub(activeIndex, 1), add(activeIndex, 1))),
                    ]),
                    onChange(hoverIndex, block([
                        cond(greaterOrEq(hoverIndex, 0), [
                            call([hoverIndex, isMoveUp], ([a, b]) => {
                                // console.info('dcm hoverIndex', a)
                                if (b == 1) {
                                    // Up
                                    console.info('dcm swap', a, a + 1)
                                    tron({ indexStart: a, indexEnd: a + 1 })

                                }
                                if (b == -1) {
                                    // Down
                                    console.info('dcm swap', a - 1, a)
                                    tron({ indexStart: a - 1, indexEnd: a })

                                }
                                // 
                            })
                        ])
                    ])),

                ])} />
            </Animated.View>
        )
    }, [state.hoverComponent])
    const viewabilityConfig = useMemo(() => {
        return { viewAreaCoveragePercentThreshold: 50 }
    }, [])
    const onViewableItemsChanged = useCallback(({
        viewableItems,
        changed,
    }) => {
        // console.info('dasdadasdasd', viewableItems,
        //     changed)
        dic.current.viewableItems = viewableItems
    }, [])
    const getItemLayout = useCallback((data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    ), [])
    const renderList = useMemo(() => {
        return (
            <AnimatedFlatList
                updateCellsBatchingPeriod={30}
                getItemLayout={getItemLayout}
                viewabilityConfig={viewabilityConfig}
                scrollEnabled={!state.hoverComponent}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onMomentumScrollEnd={scrollEvent}
                onScrollEndDrag={scrollEvent}
                onViewableItemsChanged={onViewableItemsChanged}
                data={state.data} />
        )
    }, [state.data, state.hoverComponent])
    const onRelease = useCallback(() => {
        activeIndex.setValue(-1)
        hoverIndex.setValue(-1)
        translateYOffset.setValue(0)
        translationY.setValue(0)
        dispatch({
            type: TYPE.CHANGE_HOVER_COMPONENT,
            payload: {
                hoverComponent: null,
                item: {}
            }
        })
    }, [])
    useCode(block([
        cond(or(
            eq(panState, State.END),
            eq(panState, State.CANCELLED),
            eq(panState, State.FAILED)
        ), [call([], onRelease)]),
        call([contentOffsetY], ([a]) => {
            // console.info('contentOffset', a)
        })
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
