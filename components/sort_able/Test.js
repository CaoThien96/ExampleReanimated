import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { View, Text, FlatList, LayoutAnimation, Platform, UIManager, Animated as AnimatedV1, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Animated, { Transitioning } from 'react-native-reanimated'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import {
    ReText,
    clamp,
    onGestureEvent,
    snapPoint,
    timing,
    onScrollEvent,
    opacity
} from "../../libs/redash";
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}
const { Value, eq, max, set, call, onChange, block, useCode, cond, add, divide, round, diff, greaterThan, greaterOrEq, lessThan, multiply, sub, and, or, abs, lessOrEq } = Animated
function immutableMove(arr, from, to) {
    return arr.reduce((prev, current, idx, self) => {
        if (from === to) {
            prev.push(current);
        }
        if (idx === from) {
            return prev;
        }
        if (from < to) {
            prev.push(current);
        }
        if (idx === to) {
            prev.push(self[from]);
        }
        if (from > to) {
            prev.push(current);
        }
        return prev;
    }, []);
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const exampleData = [...Array(20)].map((d, index) => ({
    key: `item-${index}`, // For example only -- don't use index as your key!
    label: index,
    backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index *
        5}, ${132})`,
    index: index
}));
const Test = () => {
    const [data, setData] = useState(exampleData)
    const [draging, setDraging] = useState(false)
    const [activeKey, setActiveKey] = useState(null)
    const refFlatList = useRef()
    const [panState, translationY, TestValue] = useMemo(() => {
        return [
            new Value(State.UNDETERMINED),
            new Value(0),
            new AnimatedV1.Value(1000)
        ]
    }, [])
    const { contentOffsetY, y, containerSizeAni, scrollSizeAni, scrollPositionTolerance, isScrollingAni, translateYHoverAni } = useMemo(() => {
        return {
            contentOffsetY: new Value(0),
            y: new Value(0),
            containerSizeAni: new Value(0),
            scrollSizeAni: new Value(0),
            scrollPositionTolerance: new Value(2),
            isScrollingAni: new Value(0),
            translateYHoverAni: new Value(0)
        }
    }, [])
    const isScrolledUp = useMemo(() => {
        return lessOrEq(sub(contentOffsetY, scrollPositionTolerance), 0);
    }, [])
    const isScrolledDown = useMemo(() => greaterOrEq(
        add(contentOffsetY, scrollSizeAni, scrollPositionTolerance),
        scrollSizeAni
    ), [])
    const dic = useRef({
        hoverComponent: null,
        activeItem: null,
        curIndex: null,
        data: exampleData,
        isScrolling: false
    })
    const scrollEvent = onScrollEvent({ y: contentOffsetY })
    const gestureHandler = onGestureEvent({ state: panState, translationY, y }, []);
    const tron = useCallback(() => {
        AnimatedV1.timing(TestValue, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true
        }).start()
        return
        const indexStart = 4
        const indexEnd = 5
        const left = data.slice(0, indexStart - 1)
        const mid = data.slice(indexStart, indexEnd - 1)
        const end = data.slice(indexEnd, exampleData.length)
        const itemTop = data[indexStart - 1]
        const itemBottom = data[indexEnd - 1]
        console.info('left,mid,itemTop', itemTop, itemBottom, left, mid, end)
        const newData = [...left, itemBottom, ...mid, itemTop, ...end]
        console.info('new Date', newData)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
        setData(newData)
    }, [data])
    const onDrag = useCallback(({ activeItem }) => {
        dic.current.hoverComponent = renderItem({ item: activeItem, isHover: true })
        dic.current.activeItem = activeItem
        setDraging(true)
        setActiveKey(dic.current.activeItem.key)
    }, [])
    const renderItem = useCallback(({ item, index, isHover = false }) => {
        return (
            <AnimatedV1.View>
                <TouchableOpacity disabled={!!isHover} onLongPress={() => { onDrag({ activeItem: item }) }} style={{
                    height: 100,
                    width: '100%',


                }}>
                    <View style={{
                        backgroundColor: isHover ? 'blue' : 'red',
                        flex: 1, opacity: dic.current.activeItem && item.key === dic.current.activeItem.key ? isHover ? 1 : 0 : 1
                    }}>
                        <Text>{item.label}</Text>
                    </View>
                </TouchableOpacity>
            </AnimatedV1.View >

        )
    }, [])
    const startAutoScrollDown = useCallback((contentOffsetY = 0) => {
        if (!dic.current.isScrolling) return
        if (dic.current.scrollSize <= dic.current.containerSize + contentOffsetY + 100) {
            dic.current.isScrolling = false
            isScrollingAni.setValue(0)
            return refFlatList.current._component.scrollToOffset({ offset: dic.current.scrollSize - dic.current.containerSize, animated: false })
        }
        refFlatList.current._component.scrollToOffset({ offset: contentOffsetY + 100, animated: false })
        requestAnimationFrame(() => {
            dic.current.isScrolling && startAutoScrollDown(contentOffsetY + 10)
        })
    }, [])
    const rednerHoverComponent = useCallback(() => {
        if (!dic.current.hoverComponent) return (<View></View>)
        const offset = dic.current.activeItem.index * 100
        const translateY = new Value(0)

        const distToBottomEdge = max(
            0,
            sub(containerSizeAni, add(add(sub(offset, contentOffsetY), translationY), 100))
        );
        const distToTopEdge = max(0, add(sub(offset, contentOffsetY), translationY));
        dic.current.curIndex = dic.current.activeItem.index
        return (
            <Animated.View pointerEvents={'box-none'} style={[StyleSheet.absoluteFillObject, {
                transform: [
                    {
                        translateY: translateYHoverAni
                    }
                ]
            }]}>
                {dic.current.hoverComponent}
                <Animated.Code
                    exec={block([
                        call([isScrollingAni], ([a]) => {
                            console.info('DCM isScrollingAni', a)
                            // const index = getIndex({ offsetY: a })
                            // if (index !== dic.current.curIndex) {
                            //     console.info('DCM swap', dic.current.curIndex, index)
                            //     // dic.current.data = immutableMove(dic.current.data, dic.current.curIndex, index)
                            //     // setData(dic.current.data)
                            //     dic.current.curIndex = index
                            // }
                        }),
                        cond(
                            and(
                                eq(panState, State.ACTIVE),
                                eq(isScrollingAni, 0)
                            ),
                            [
                                set(translateYHoverAni, clamp(add(sub(offset, contentOffsetY), translationY), 0, sub(containerSizeAni, 100))),

                            ]
                        )
                    ])}
                />
                <Animated.Code exec={block([
                    onChange(
                        contentOffsetY,
                        [
                            call([add(sub(offset), translationY)], ([a]) => {
                                console.info('DCM offset', a)
                                // const index = getIndex({ offsetY: a })
                                // if (index !== dic.current.curIndex) {
                                //     console.info('DCM swap', dic.current.curIndex, index)
                                //     // dic.current.data = immutableMove(dic.current.data, dic.current.curIndex, index)
                                //     // setData(dic.current.data)
                                //     dic.current.curIndex = index
                                // }
                            })
                        ])
                ])} />
                {/* <Animated.Code
                    exec={block([
                        onChange(translateY, [
                            call([add(translateY, contentOffsetY)], ([a]) => {
                                const index = getIndex({ offsetY: a })
                                if (index !== dic.current.curIndex) {
                                    console.info('DCM swap', dic.current.curIndex, index)
                                    // dic.current.data = immutableMove(dic.current.data, dic.current.curIndex, index)
                                    // setData(dic.current.data)
                                    dic.current.curIndex = index
                                }
                            })
                        ])
                    ])}
                /> */}
                <Animated.Code
                    exec={block([
                        onChange(distToBottomEdge, [
                            call([distToBottomEdge, distToTopEdge, contentOffsetY], ([a, b, c]) => {
                                // console.info('distToBottomEdge', a, b)
                                if (a == 0) {
                                    console.info('dcm start auto scroll', c)
                                    dic.current.isScrolling = true
                                    isScrollingAni.setValue(1)
                                    setTimeout(() => {
                                        startAutoScrollDown(c)
                                    }, 0);
                                } else {
                                    // if (dic.current.isScrolling) {
                                    //     console.info('dcm stop auto scroll')
                                    //     dic.current.isScrolling = false
                                    //     isScrollingAni.setValue(0)
                                    // }
                                }
                            })
                        ])
                    ])}
                />

            </Animated.View>
        )
    }, [])
    const onRelease = useCallback(() => {
        dic.current.hoverComponent = null
        dic.current.activeItem = null
        dic.current.isScrolling = false
        translationY.setValue(0)
        setDraging(false)

        setTimeout(() => {
            setActiveKey(null)
        }, 500);
    }, [])
    const getIndex = useCallback(({ offsetY }) => {
        if ((offsetY + dic.current.contentOffsetY) < 50) return 0
        // (index-1)*100+50=offsetY
        if (Math.floor(((offsetY - 50) / 100) + 1) < 0) return 0
        if (Math.floor(((offsetY - 50) / 100) + 1) > dic.current.data.length - 1) return dic.current.data.length
        return Math.floor(((offsetY - 50) / 100) + 1)
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
        <View style={{
            flex: 1
        }}>
            <View style={{
                height: 100,
                backgroundColor: 'yellow'
            }}></View>
            <PanGestureHandler
                {...gestureHandler}
            >
                <Animated.View
                    onLayout={(e) => {
                        const heightContent = e.nativeEvent.layout.height
                        if (dic.current.containerSize !== heightContent) {
                            dic.current.containerSize = heightContent
                            containerSizeAni.setValue(heightContent)
                            console.info('dic.current.containerSize', dic.current.containerSize)
                        }
                    }}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: 'red',
                    }}>
                    <AnimatedFlatList
                        ref={refFlatList}
                        onContentSizeChange={(e, scrollSize) => {
                            if (dic.current.scrollSize !== scrollSize) {
                                scrollSizeAni.setValue(scrollSize)
                            }
                        }}
                        scrollEnabled={!draging}
                        data={data}
                        onScroll={scrollEvent}
                        onMomentumScrollEnd={scrollEvent}
                        onScrollEndDrag={scrollEvent}
                        renderItem={renderItem}
                    />
                    {rednerHoverComponent()}
                </Animated.View>
            </PanGestureHandler>
            <View style={{
                height: 100,
                backgroundColor: 'yellow'
            }}></View>
        </View>

    )
}
Test.propTypes = {}
Test.defaultProps = {}
export default Test
