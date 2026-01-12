import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ListRenderItem,
  Modal,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Todo } from '../types';

const STORAGE_KEY = '@hermit_pad_todos';

export default function ListScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 从本地存储加载数据
  useEffect(() => {
    loadTodos();
  }, []);

  // 当 todos 变化时保存到本地存储
  useEffect(() => {
    if (!isLoading) {
      saveTodos(todos);
    }
  }, [todos, isLoading]);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      Alert.alert('错误', '加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async (todosToSave: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todosToSave));
    } catch (error) {
      console.error('保存数据失败:', error);
      Alert.alert('错误', '保存数据失败');
    }
  };

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

  // 导出数据
  const exportData = async () => {
    try {
      const dataStr = JSON.stringify(todos, null, 2);
      
      if (Platform.OS === 'web') {
        // Web 平台使用下载
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hermit-pad-todos.json';
        a.click();
        URL.revokeObjectURL(url);
        Alert.alert('成功', '数据已导出');
      } else {
        // 移动端使用分享或复制到剪贴板
        await Clipboard.setStringAsync(dataStr);
        Alert.alert('成功', '数据已复制到剪贴板，可粘贴到其他应用保存');
      }
      setShowSettings(false);
    } catch (error) {
      console.error('导出失败:', error);
      Alert.alert('错误', '导出数据失败');
    }
  };

  // 导入数据
  const handleImport = () => {
    setShowSettings(false);
    setShowImportModal(true);
  };

  const confirmImport = () => {
    try {
      const parsedData = JSON.parse(importData);
      
      if (!Array.isArray(parsedData)) {
        Alert.alert('错误', '数据格式不正确，请确保是有效的 JSON 数组');
        return;
      }

      // 验证数据结构
      const isValid = parsedData.every(
        (item: Todo) =>
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.completed === 'boolean'
      );

      if (!isValid) {
        Alert.alert('错误', '数据格式不正确，请检查数据结构');
        return;
      }

      Alert.alert(
        '确认导入',
        '导入将覆盖当前所有数据，确定继续吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: () => {
              setTodos(parsedData);
              setImportData('');
              setShowImportModal(false);
              Alert.alert('成功', '数据导入成功');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '请输入有效的 JSON 数据');
    }
  };

  // 从剪贴板粘贴
  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setImportData(text);
      } else {
        Alert.alert('提示', '剪贴板为空');
      }
    } catch (error) {
      Alert.alert('错误', '无法访问剪贴板');
    }
  };

  const renderTodoItem: ListRenderItem<Todo> = ({ item }) => (
    <View style={styles.todoItem}>
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
    </View>
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

      {/* 设置按钮 */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* 设置菜单 Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <View style={styles.settingsMenu}>
            <Text style={styles.settingsTitle}>设置</Text>
            <TouchableOpacity style={styles.settingsItem} onPress={handleImport}>
              <Text style={styles.settingsItemIcon}>📥</Text>
              <Text style={styles.settingsItemText}>导入数据</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsItem} onPress={exportData}>
              <Text style={styles.settingsItemIcon}>📤</Text>
              <Text style={styles.settingsItemText}>导出数据</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingsItem, styles.settingsItemCancel]}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.settingsItemCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 导入数据 Modal */}
      <Modal
        visible={showImportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImportModal(false)}
      >
        <View style={styles.importModalOverlay}>
          <View style={styles.importModal}>
            <Text style={styles.importTitle}>导入数据</Text>
            <Text style={styles.importHint}>请粘贴 JSON 格式的待办数据：</Text>
            <TextInput
              style={styles.importInput}
              multiline
              placeholder='[{"id": "1", "title": "示例", "completed": false, "description": ""}]'
              value={importData}
              onChangeText={setImportData}
            />
            <View style={styles.importButtons}>
              <TouchableOpacity
                style={styles.pasteButton}
                onPress={pasteFromClipboard}
              >
                <Text style={styles.pasteButtonText}>从剪贴板粘贴</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.importActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setImportData('');
                  setShowImportModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmImport}
              >
                <Text style={styles.confirmButtonText}>确认导入</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 80,
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
  // 设置按钮样式
  settingsButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  settingsIcon: {
    fontSize: 24,
  },
  // 设置菜单样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsMenu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#333',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#333',
  },
  settingsItemCancel: {
    justifyContent: 'center',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  settingsItemCancelText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    width: '100%',
  },
  // 导入 Modal 样式
  importModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  importModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  importTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  importHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  importInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 150,
    fontSize: 14,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  importButtons: {
    marginTop: 10,
  },
  pasteButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pasteButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  importActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
