import React, { useMemo, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { StatusBar, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, Easing, TouchableOpacity, Dimensions } from 'react-native';
import LoadingComp, { TestPanel } from './LoadingComp'
import BoxTransition from './components/BoxTransition/BoxTransition'
import RangerSlider from './components/RangerSlider'
import TextInputFake from './components/InputFake/index'
import Slider from './components/HorizontalSlider/components/Slider'
import Interactable from './components/Interactable/index'
import ListInput from './components/InputSlider/index'
import SliderTest from './components/SliderTest/index'
import BottomSheet from './components/bottom_sheet_reanimated/index'
import Animated from 'react-native-reanimated'
import ExampleSequenceFlatlist from './components/SequenceFlatList/Example'
const { height: heightDevice } = Dimensions.get('window')
if (__DEV__) {
  import('./reactotronConfig').then(() => console.log('Reactotron Configured'))
}
const Comp = ({ index, animatedValue = new Animated.Value(0) }) => {
  const [isShow, setShow] = useState(false)
  useLayoutEffect(() => {
    animatedValue.addListener(({ value }) => {
      const count = Math.random()
      console.log('dasdasdsdas', value, count)
      if (value === index * 100) {
        console.log('dcm shoiw', index)
        setShow(true)
      }
    })
  }, [])
  if (!isShow) return null
  return (<Text style={{
    width: '100%',
    height: 24,
    textAlign: 'center',
    backgroundColor: 'red',
    marginTop: 16
  }}>{index}</Text>)
}
export default function App() {
  const { animatedValue, translateMaster, scrollValue } = useMemo(() => {
    return {
      animatedValue: new Animated.Value(0),
      translateMaster: new Animated.Value(0),
      scrollValue: new Animated.Value(0)
    }
  }, [])
  useEffect(() => {

  }, [])
  return (
    <View style={styles.container}>
      <StatusBar />
      <ExampleSequenceFlatlist />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 16
  },
});
