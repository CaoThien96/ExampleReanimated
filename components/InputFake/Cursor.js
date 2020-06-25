import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated'
import { loop } from '../../libs/redash/index'
const componentName = ({
    value
}) => {
    const opacity = useMemo(() => {
        return loop({
            duration: 300,
            boomerang: true
        })
    }, [])
    return (
        <Animated.View style={{
            width: 2, height: 16, backgroundColor: 'gray', opacity, transform: [{
                translateX: value
            }]
        }}>

        </Animated.View>
    )
};

export default componentName;
