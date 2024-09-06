import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Router from '@/router/Router';

export default function App() {
    return (
        <View style={{flex: 1}}>
            <Router/>
            <StatusBar hidden={true}/>
        </View>
    );
};
