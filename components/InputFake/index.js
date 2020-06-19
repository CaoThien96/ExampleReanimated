import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Cursor from './Cursor'
const componentName = ({
    params,
}) => {
    const [text, setText] = useState('')
    const [isfocus, setFocus] = useState(false)
    return (
        <TouchableWithoutFeedback

            onPress={() => {
                Keyboard.dismiss()
                setFocus(false)
            }}
        >
            <View style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: 'center',
                width: '100%'
            }}>
                <TouchableOpacity
                    onPress={() => setFocus(true)}
                    activeOpacity={1}
                    style={{
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderWidth: 1
                    }}>
                    <TextInput placeholder={'Enter text'} style={{

                    }} />
                    {isfocus && <Cursor />}
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    )
};

export default componentName;
