import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ListRenderItem,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Todo } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

export default function ListScreen({ navigation }: Props) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: '学习 React Native', completed: false, description: '学习 React Native 基础知识和组件' },
    { id: '2', title: '完成项目开发', completed: false, description: '使用 Expo 创建 Todo List 应用' },
    { id: '3', title: '代码审查', completed: true, description: '检查代码质量和最佳实践' },
  ]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  const addTodo = () => {
    if (newTodoTitle.trim() === '') {
      Alert.alert('提示', '请输入待办事项标题');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: newTodoTitle.trim(),
      completed: false,
      description: '',
    };

    setTodos([newTodo, ...todos]);
    setNewTodoTitle('');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个待办事项吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => setTodos(todos.filter((todo) => todo.id !== id)),
        },
      ]
    );
  };

  const navigateToDetail = (todo: Todo) => {
    navigation.navigate('Detail', { 
      todo,
      updateTodo: (updatedTodo: Todo) => {
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
        );
      },
    });
  };

  const renderTodoItem: ListRenderItem<Todo> = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => navigateToDetail(item)}
    >
      <View style={styles.todoContent}>
        <TouchableOpacity
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
          onPress={() => toggleTodo(item.id)}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        <View style={styles.todoText}>
          <Text
            style={[
              styles.todoTitle,
              item.completed && styles.todoTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.todoDescription} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>删除</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的待办事项</Text>
        <Text style={styles.headerStats}>
          已完成 {completedCount} / {totalCount}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="添加新的待办事项..."
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>添加</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无待办事项</Text>
            <Text style={styles.emptySubtext}>添加一个新的待办事项开始吧！</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerStats: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  todoItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todoContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
});
