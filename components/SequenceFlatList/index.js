import React, { PureComponent, Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated'


import RowLoading from './RowLoading'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { timing } from '../../libs/redash/index'
import { State } from 'react-native-gesture-handler'
export const TYPE_ANIMATION = {
    'FADE_IN': 'FADE_IN',
    'FADE_OUT': 'FADE_OUT',
    'SLIDE_IN_LEFT': 'SLIDE_IN_LEFT',
    'SLIDE_IN_RIGHT': 'SLIDE_IN_RIGHT'
}
const { width: widthDevice, height: heightDevice } = Dimensions.get('window')
const { block, eq, cond, set, clockRunning, stopClock, Value, not, Clock } = Animated
export class SquenceView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type || 'SLIDE_IN_LEFT'
        };
        this.progressValue = this.props.progressValue || new Animated.Value(0)
        this.duration = this.props.duration || 1000
        this.index = this.props.index || 0
        this.totalCountData = this.props.totalCountData || 10
        this.delta = this.duration / this.totalCountData
        let x = 1



    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.duration !== this.duration) {
            this.duration = nextProps.duration
            this.delta = this.duration / this.totalCountData
        }

    }
    getDetal = () => {
        return this.duration / this.totalCountData
    }
    getStartInterpolate = () => {
        return this.delta + this.index * this.delta / 2
    }
    getEndInterpolate = () => {
        console.log('DCM ', this.index * this.delta + this.delta, this.index)
        return this.index * this.delta + this.delta
    }
    getOutputRangeOpacity = () => {
        switch (this.props.type) {
            case TYPE_ANIMATION.FADE_IN:
                return [0, 1, 1]
            case TYPE_ANIMATION.FADE_OUT:
                return [1, 0, 0]
            default:
                return [1, 1, 1]
        }
    }

    getOutputRangeTranslation = () => {
        switch (this.props.type) {
            case TYPE_ANIMATION.SLIDE_IN_LEFT:
                return [-widthDevice, 0, 0]
            case TYPE_ANIMATION.SLIDE_IN_RIGHT:
                return [widthDevice, 0, 0]
            default:
                return [0, 0, 0]
        }
    }
    getInterpolateOpacity = () => {
        return Animated.interpolate(this.progressValue, {
            inputRange: [this.getStartInterpolate(), this.getEndInterpolate(), this.duration + this.index * this.delta / 2],
            outputRange: this.getOutputRangeOpacity()
        })
    }
    getInterpolateTranslation = () => {
        return Animated.interpolate(this.progressValue, {
            inputRange: [this.getStartInterpolate(), this.getEndInterpolate(), this.duration + this.index * this.delta / 2],
            outputRange: this.getOutputRangeTranslation()
        })
    }
    mapInterpolateToRender = () => {
        return (<Animated.View style={{
            opacity: this.getInterpolateOpacity(),
            transform: [{
                translateX: this.getInterpolateTranslation()
            }]
        }}>
            {
                this.props.children
            }
        </Animated.View>)
    }

    render() {
        return (
            <View>
                {this.mapInterpolateToRender()}
            </View>
        );
    }
}
export default class FlatListAni extends Component {
    constructor(props) {
        super(props)
        this.progressValue = new Animated.Value(0)
        this.totalCountData = Array.isArray(this.props.data) ? this.props.data.length : 10
        this.duration = this.props.duration || 1000
        this.clock = new Clock()
        this.state = {
            type: this.props.type || TYPE_ANIMATION.FADE_IN
        }
        this.stateAni = new Animated.Value(State.UNDETERMINED)
        this.needReset = new Value(0)
    }
    componentDidMount() {
        // this.runAnimation()
        this.stateAni.setValue(State.ACTIVE)
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoading && nextProps.isLoading !== this.props.isLoading) {
            // this.progressValue.setValue(0)
            // this.runAnimation()
        }
    }
    // shouldComponentUpdate() {
    //     return false
    // }
    runAnimation = () => {
        Animated.timing(this.progressValue, {
            toValue: this.duration,
            duration: this.duration,
            easing: Easing.linear
        }).start(() => {
            console.info("DONE")
        })
    }
    animate = ({
        type,
        duration
    }) => {

        if (duration) {
            this.duration = duration
        }

        this.setState({
            type
        }, () => {

        })
        this.needReset.setValue(1)
        this.stateAni.setValue(State.ACTIVE)
    }
    renderItem = ({ index, item }) => {
        return (
            <SquenceView key={`SquenceView-${index}-${item.news_id}`} progressValue={this.progressValue} duration={this.duration} type={this.state.type} key={`${index}-${item}`} index={index} totalCountData={this.props.data.length}>
                {/* <View style={{
                    height: 44,
                    width: '100%',
                    backgroundColor: index % 2 === 0 ? 'red' : 'blue',
                    marginTop: 16
                }}>

                </View> */}
                <RowLoading index={index} item={item} />
            </SquenceView>
        )
    }

    render() {
        return (
            <React.Fragment>
                <Animated.Code exec={block([
                    cond(not(clockRunning(this.clock)), [

                    ], [
                        cond(eq(this.needReset, 1), [
                            set(this.needReset, 0),
                            stopClock(this.clock)
                        ], [])
                    ]),
                    cond(eq(this.stateAni, State.ACTIVE), [set(this.progressValue, timing({
                        clock: this.clock,
                        from: 0,
                        to: 1000,
                        duration: 1000
                    }))])
                ])} />
                <TouchableOpacity onPress={() => this.animate({
                    type: TYPE_ANIMATION.SLIDE_IN_LEFT, duration: 1000
                })}>
                    <Text>Slide Left</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.animate({
                    type: TYPE_ANIMATION.SLIDE_IN_RIGHT, duration: 1000
                })}>
                    <Text>Slide Rigt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.animate({
                    type: TYPE_ANIMATION.FADE_IN
                })}>
                    <Text>Slide Fade In</Text>
                </TouchableOpacity>
                <ScrollView>
                    {
                        this.props.data.map(el => this.renderItem({
                            item: el, index: el
                        }))
                    }
                </ScrollView>
                {/* <FlatList
                    extraData={this.props.data}
                    keyExtractor={(item, index) => `${item.news_id}#${index}#${this.state.type}`}
                    {...this.props}
                    data={this.props.data}
                    renderItem={this.renderItem}

                /> */}
            </React.Fragment>
        )
    }
}
