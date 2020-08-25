import React, { useState, useCallback, useRef, useEffect, PureComponent, useLayoutEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

// Component
export function ViewLoading({ children }) {
    return (
        <View style={{
            alignSelf: 'baseline',
            backgroundColor: '#434651',
            borderRadius: 4
        }}>
            {children}
        </View>
    )
}
export default React.memo(({ index }) => {
    return (
        <View
            style={[{ marginTop: index === 0 ? 0 : 8, flexDirection: 'column', height: 100, backgroundColor: index % 2 === 0 ? 'red' : 'blue' }]}
        >

        </View>
    )
}, () => true)
