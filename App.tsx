import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ListScreen from './screens/ListScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListScreen />
    </GestureHandlerRootView>
  );
}
