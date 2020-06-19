import React, { useMemo, useReducer, useRef, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated'
import Input from './Input'
import Slider from '../Interactable/index'
const { Provider, Consumer } = React.createContext({})
const { Value } = Animated
const TYPE = {
    limitPrice: 'limitPrice',
    triggerPrice: 'triggerPrice'
}
const componentName = ({
    params,
}) => {
    const dic = useRef({
        limitPrice: new Value(0),
        triggerPrice: new Value(0),
        value: 0
    })
    const [type, setType] = useState(TYPE.limitPrice)
    return (
        <Provider>
            <View style={{ flex: 1, justifyContent: 'center', borderWidth: 1, width: '100%' }}>
                <Input onFocus={(value) => {
                    dic.current.value = value
                    setType(TYPE.limitPrice)
                }} priceValue={dic.current.limitPrice} label="limitPrice" />
                <Input onFocus={(value) => {
                    dic.current.value = value
                    setType(TYPE.triggerPrice)
                }} priceValue={dic.current.triggerPrice} label="triggerPrice" />
                {
                    type === TYPE.limitPrice ? (<Slider value={dic.current.value} key='limit' color={'red'} priceValue={dic.current.limitPrice} />) : (<Slider value={dic.current.value} key='triiger' color={'blue'} priceValue={dic.current.triggerPrice} />)
                }


            </View>
        </Provider>

    )
};

export default componentName;
