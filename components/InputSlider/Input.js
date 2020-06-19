import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated'
const { block, call } = Animated
const componentName = ({
    label, onFocus, priceValue
}) => {
    const [text, setText] = useState(0)
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{label || 'Label'}</Text>
            <TouchableOpacity onPress={() => {
                console.info('DCM text', text)
                onFocus && onFocus(text)
            }} style={{ paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderRadius: 8 }}>
                <Text>{text}</Text>
            </TouchableOpacity>
            <Animated.Code
                exec={block([
                    call([priceValue], ([a]) => {
                        console.info('DCM priceValue', a, text)
                        setText(parseFloat(a).toFixed(4))
                    })
                ])}
            />
        </View>
    )
};

export default componentName;
