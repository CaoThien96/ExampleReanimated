import React from 'react';
import { View } from 'react-native';

import FlatListReAni from './index'
const fakeDataNews = [
    {
        'news_id': 1038017311455314439
    },
    {
        'news_id': 1038017311455314440
    },

    {
        'news_id': 1038017311455314441
    },

    {
        'news_id': 1038017311455314442
    },

    {
        'news_id': 1038017311455314443
    },

    {
        'news_id': 1038017311455314444
    },

    {
        'news_id': 1038017311455314445
    },

    {
        'news_id': 1038017311455314446
    },

    {
        'news_id': 1038017311455314447
    }
]
let arr = []
for (let index = 0; index < 10; index++) {
    arr.push(index)
}
const Example = ({
    children, style, ...rest
}) => (
        <View style={{
            borderWidth: 1, borderColor: 'red', flex: 1, width: '100%'
        }}>
            <FlatListReAni style={{
                paddingHorizontal: 8
            }} data={arr} />
        </View>
    );

export default Example;
