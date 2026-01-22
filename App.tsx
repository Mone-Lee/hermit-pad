import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ListScreen from './screens/ListScreen';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ListScreen />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
