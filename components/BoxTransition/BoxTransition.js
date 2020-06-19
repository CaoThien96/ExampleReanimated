import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';
import { Transitioning, Transition } from 'react-native-reanimated';
const transition = (
    <Transition.Sequence>
        <Transition.Out type="fade" />
        <Transition.Change interpolation="easeInOut" />
        <Transition.In type='slide-bottom' />
    </Transition.Sequence>
);
export default class TransitionView extends React.Component {
    state = {
        isShow: false
    }
    show = this.show.bind(this)
    show() {
        this.ref.animateNextTransition();
        this.setState({
            isShow: true
        })
    }
    componentDidMount() {
        console.info('DCM did mount')
        setTimeout(() => {
            console.info('DCM did mount')
            this.show()
        }, 0);
    }
    hide = this.hide.bind(this)
    hide() {
        this.ref.animateNextTransition();
        this.setState({
            isShow: false
        })
    }
    render() {
        const { typeOut, typeIn } = this.props
        const transition = (
            <Transition.Sequence>
                <Transition.Out durationMs={300} type={typeOut || 'fade'} />
                <Transition.Change durationMs={300} interpolation="easeInOut" />
                <Transition.In durationMs={300} type={typeIn || 'slide-bottom'} />
            </Transition.Sequence>
        );
        return (
            <React.Fragment>
                <Button
                    title="show or hide"
                    color="#FF5252"
                    onPress={() => {
                        this.ref.animateNextTransition();
                        this.show();
                    }}
                />
                <Button
                    title=" hide"
                    color="#FF5252"
                    onPress={() => {
                        this.ref.animateNextTransition();
                        this.hide();
                    }}
                />
                <Transitioning.View
                    ref={ref => this.ref = ref}
                    transition={transition}
                    style={{ flex: 1, width: '100%' }}>

                    {this.state.isShow && (
                        <View style={{ flex: 1, borderWidth: 1, backgroundColor: 'red' }} />
                    )}
                </Transitioning.View>
            </React.Fragment>
        )
    }
}
function Sequence() {
    const transition = (
        <Transition.Sequence>
            <Transition.Out type="fade" />
            <Transition.Change interpolation="easeInOut" />
            <Transition.In type='slide-bottom' />
        </Transition.Sequence>
    );

    let [showText, setShowText] = useState(true);
    let [count, setCount] = useState(0)
    const ref = useRef();
    useEffect(() => {
        setInterval(() => {
            setCount(count++)
        }, 1000 * 1);
    }, [])
    return (
        <React.Fragment>
            <Button
                title="show or hide"
                color="#FF5252"
                onPress={() => {
                    ref.current.animateNextTransition();
                    setShowText(!showText);
                }}
            />
            <Text>{count}</Text>
            <Transitioning.View
                ref={ref}
                transition={transition}
                style={{ flex: 1, width: '100%' }}>

                {showText && (
                    <View style={{ flex: 1, borderWidth: 1, backgroundColor: 'red' }} />
                )}
            </Transitioning.View>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    centerAll: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        margin: 10,
    },
});

// export default Sequence;