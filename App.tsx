import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="List" 
          component={ListScreen}
          options={{ title: '待办列表' }}
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen}
          options={{ 
            title: '待办详情',
            headerShown: true,
            headerBackTitle: '返回',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
