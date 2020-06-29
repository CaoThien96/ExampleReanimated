import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoadingComp, { TestPanel } from './LoadingComp'
import BoxTransition from './components/BoxTransition/BoxTransition'
import RangerSlider from './components/RangerSlider'
import TextInputFake from './components/InputFake/index'
import Slider from './components/HorizontalSlider/components/Slider'
import Interactable from './components/Interactable/index'
import ListInput from './components/InputSlider/index'
import SliderTest from './components/SliderTest/index'
if (__DEV__) {
  import('./reactotronConfig').then(() => console.log('Reactotron Configured'))
}
export default function App() {
  const [value, setValue] = useState('')
  return (
    <View style={styles.container}>
      <Text>
        Cao Van Thien
      </Text>
      <TextInput onChangeText={text => setValue(text)} value={value} placeholder={'Enter text'} />
      <TextInputFake value={value} />
      {/* <View style={{
        backgroundColor: 'blue', flex: 1, alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        paddingHorizontal: 16
      }}>

      </View> */}
      {/* <ListInput minValue={1} maxValue={2} step={0.1} /> */}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: 16
  },
});
