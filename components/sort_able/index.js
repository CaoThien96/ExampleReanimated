import React, { useEffect, useState, useCallback, useReducer, useMemo, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, LayoutAnimation, UIManager, Platform } from 'react-native'
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
    timing,
    round as reRound
} from "../../libs/redash";
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const ITEM_HEIGHT = 100
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const { height: heightDevices } = Dimensions.get('window')
const { floor, Value, eq, set, call, onChange, block, useCode, cond, add, divide, round, diff, greaterThan, greaterOrEq, lessThan, multiply, sub, and, or, abs, lessOrEq } = Animated
const Alpha = ['A', 'B', 'C', 'D', 'E']
const exampleData = [...Array(12)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: 'red'
}));
const useInitData = () => useMemo(() => {
    return [
        new Value(-1),
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
const Item = React.memo(({ item, index, isHover = false, onDrag, isActive, onSnapToTop }) => {
    const onSnapToTopCb = useMemo(() => {
        return () => onSnapToTop({ item, index })
    }, [])
    return (
        <TouchableOpacity
            onPress={onSnapToTopCb}
            disabled={isHover}
            onLongPress={() => onDrag(item, index)}
        >
            <View style={{
                height: 90,
                backgroundColor: 'red',
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
                opacity: isActive ? 0 : 1,
                borderWidth: 1
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
            </View>

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
const findIndexActive = ({ item, viewableItems, keyExtractor }) => {
    const key = keyExtractor(item)
    let activeItem = null
    let activeIndex = null

    viewableItems.forEach((element, index) => {
        if (keyExtractor(element.item) === key) {
            activeItem = element;
            activeIndex = index
        }
    });
    console.info('DCM key', activeItem,
        activeIndex)

    return {
        activeItem,
        activeIndex
    }
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
    const [activeIndex, hoverIndex, isMoveUp] = useInitData()
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
    // const isMoveUp = useListenerDirectionMove(velocityY)
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
    const handleSnapToTop = useCallback(({ item }) => {
        const key = keyExtractor(item)
        console.info('DCM key', key, dic.current.viewableItems)
        let activeItem = null
        let activeIndex = null

        dic.current.viewableItems.forEach((element, index) => {
            if (keyExtractor(element.item) === key) {
                activeItem = element;
                activeIndex = index
            }
        });
        tronV2(activeIndex)
        console.info('DCM activeItem', activeItem, activeIndex)
    }, [])
    const tronV2 = useCallback((activeIndex) => {
        dic.current.viewableItems
        // Handle trong activeIndex with activeIndex -1 
        if (activeIndex <= 0) return
        console.info('DCM start swap', activeIndex, activeIndex - 1)
        tron({ indexStart: activeIndex - 1, indexEnd: activeIndex })
        tronV2(activeIndex - 1)
    }, [])
    const tron = useCallback(({ indexStart = 4, indexEnd = 5 }) => {
        const data = dic.current.data
        const left = data.slice(0, indexStart)
        const mid = data.slice(indexStart, indexEnd - 1)
        const end = data.slice(indexEnd + 1, data.length)
        const itemTop = data[indexStart]
        const itemBottom = data[indexEnd]
        const newData = [...left, itemBottom, ...mid, itemTop, ...end]
        LayoutAnimation.create(
            500,
            LayoutAnimation.Types.linear,
            LayoutAnimation.Properties.opacity
        )
        dic.current.data = newData,
            console.info('DCM tron left,mid,end', left, mid, end, itemTop, itemBottom, newData)
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
                {...{ item, index, isHover, onDrag, state, isActive: item.key === state.item.key, onSnapToTop: handleSnapToTop }}
            />
        )
    }, [state.item.key])
    const renderHoverRowV2 = useCallback(() => {
        if (!state.hoverComponent) return
        const key = keyExtractor(state.item)
        console.info('DCM state.hoverComponent', state, key)
        const { activeIndex: activeIndexValue, activeItem } = findIndexActive({
            item: state.item,
            viewableItems: dic.current.viewableItems,
            keyExtractor
        })
        const paddingTop = cellData.get(key).offsetY
        const indexDistance = new Value(0)
        activeIndex.setValue(activeIndexValue)
        const value = add(sub(paddingTop, contentOffsetY), translationY)
        const isTopActiveItem = cond(lessOrEq(translationY, 0), 1, 0)
        const distance = block(
            cond(
                eq(isMoveUp, DIRECTION.UP),
                cond(
                    eq(isTopActiveItem, 1),
                    add(translationY, -ITEM_HEIGHT / 2),
                    add(translationY, ITEM_HEIGHT / 2)
                ),
                cond(
                    eq(isTopActiveItem, 1),
                    add(translationY, -ITEM_HEIGHT / 2),
                    add(translationY, ITEM_HEIGHT / 2)
                )
            )
        )
        const deltal = cond(eq(isTopActiveItem, 1), multiply(floor(abs(divide(
            distance,
            ITEM_HEIGHT
        ))), -1), floor(divide(
            distance,
            ITEM_HEIGHT
        )))
        return (
            <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFillObject, {
                paddingTop: value
            }]}>
                {!!state.hoverComponent && state.hoverComponent}
                <Animated.Code exec={block([
                    onChange(translationY, block([
                        set(
                            indexDistance,
                            deltal
                        ),
                        // call([
                        //     translationY,
                        //     floor(
                        //         divide(
                        //             add(abs(translationY), ITEM_HEIGHT / 2),
                        //             ITEM_HEIGHT
                        //         )
                        //     ),
                        //     divide(
                        //         add(abs(translationY), ITEM_HEIGHT / 2),
                        //         ITEM_HEIGHT
                        //     ),
                        //     sub(activeIndexValue,
                        //         floor(
                        //             divide(
                        //                 add(abs(translationY), ITEM_HEIGHT / 2),
                        //                 ITEM_HEIGHT
                        //             )
                        //         ))
                        // ], ([a, b, c, d]) => {
                        //     console.info('DCM ', a, b, c, d)
                        // }),
                    ])),
                    onChange(indexDistance, block([
                        cond(
                            eq(isMoveUp, DIRECTION.UP),
                            call([indexDistance], ([a]) => {
                                const index = activeIndexValue + a
                                console.info('swap', index, index + 1)
                                tron({
                                    indexStart: index, indexEnd: index + 1
                                })
                            }),
                            call([indexDistance], ([a]) => {
                                const index = activeIndexValue + a
                                console.info('swap', index, index - 1)
                                tron({ indexStart: index - 1, indexEnd: index })
                            })
                        )
                    ])),
                    // onChange(velocityY, call([velocityY], ([a]) => {
                    //     // console.info('velocityY', a)
                    // })),
                    // onChange(isMoveUp, call([isMoveUp], ([a]) => {
                    //     console.info('isMove', a)
                    // })),
                    // onChange(activeIndex, block([
                    //     call([activeIndex], ([a]) => {
                    //         console.info('change activeIndex', a)
                    //     })
                    // ]))
                ])} />
            </Animated.View>
        )
    }, [state.hoverComponent])
    const renderHoverRow = useCallback(() => {
        if (!state.hoverComponent) return
        const key = keyExtractor(state.item)
        // console.info('DCM state.hoverComponent', state, key)
        const { activeIndex, activeItem } = findIndexActive({
            item: state.item,
            viewableItems: dic.current.viewableItems,
            keyExtractor
        })
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
                    )
                ])} />
                <Animated.Code exec={block([
                    onChange(activeIndex, block([
                        cond(greaterThan(activeIndex, 0), [
                            call([activeIndex, value, isMoveUp], ([a, b, c, d]) => {
                                console.info('DCM active', a)
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
                    //     paddingTop, contentOffsetY, value
                    // ], ([a, b, c]) => {
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
                            console.info('set activeIndex', a)
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

    const onViewableItemsChanged = useCallback(({
        viewableItems,
        changed,
    }) => {
        console.info("Visible items are", viewableItems);
        // console.info("Changed in this iteration", changed);
        dic.current.viewableItems = viewableItems
    }, [])
    const viewabilityConfig = useMemo(() => {
        return {
            // At least one of the viewAreaCoveragePercentThreshold or itemVisiblePercentThreshold is required.
            viewAreaCoveragePercentThreshold: 1,
        }
    }, [])
    const renderList = useMemo(() => {
        return (
            <AnimatedFlatList
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                updateCellsBatchingPeriod={30}
                getItemLayout={(data, index) => (
                    { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                )}
                scrollEnabled={!state.hoverComponent}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onMomentumScrollEnd={scrollEvent}
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
    const { preTranslationY, nextTranslationY } = useMemo(() => {
        return {
            nextTranslationY: new Value(0),
            preTranslationY: new Value(0),
        }
    }, [])
    useCode(block([
        onChange(translationY, block([
            set(preTranslationY, nextTranslationY),
            set(nextTranslationY, translationY),
            // call([preTranslationY, nextTranslationY], ([a, b]) => console.info('object', a, b)),
            cond(greaterThan(sub(nextTranslationY, preTranslationY), 0), set(isMoveUp, DIRECTION.DOWN), set(isMoveUp, DIRECTION.UP))
        ])),
        // onChange(
        //     velocityY,
        //     cond(
        //         lessThan(velocityY, 0),
        //         set(isMoveUp, DIRECTION.UP),
        //         cond(
        //             greaterThan(velocityY, 0),
        //             set(isMoveUp, DIRECTION.DOWN)
        //         ))),
        cond(or(
            eq(panState, State.END),
            eq(panState, State.CANCELLED),
            eq(panState, State.FAILED)
        ), [call([], onRelease)]),
        call([contentOffsetY], ([a]) => {
        })
    ]), [panState])
    return (
        <PanGestureHandler
            minDist={8}
            {...gestureHandler}>
            <Animated.View onLayout={e => console.info('heightDevices - e.nativeEvent.layout.height', heightDevices - e.nativeEvent.layout.height)} style={{
                flex: 1,
                borderWidth: 1,
                borderColor: 'red'
            }}>
                {renderList}
                {renderHoverRowV2()}

            </Animated.View>

        </PanGestureHandler>
    )
}
Index.propTypes = {}
Index.defaultProps = {}
export default Index
