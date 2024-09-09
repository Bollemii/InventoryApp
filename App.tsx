import { View } from 'react-native';

import Router from '@/router/Router';

const BACKGROUND_COLOR = "white";

export default function App() {
    return (
        <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR}}>
            <Router/>
        </View>
    );
};
