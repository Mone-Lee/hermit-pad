import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Todo } from '../types';

const STORAGE_KEY = '@hermit_pad_todos';

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedTodos !== null) {
      return JSON.parse(storedTodos);
    }
    return [];
  } catch (error) {
    console.error('加载数据失败:', error);
    Alert.alert('错误', '加载数据失败');
    return [];
  }
};

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('保存数据失败:', error);
    Alert.alert('错误', '保存数据失败');
  }
};
