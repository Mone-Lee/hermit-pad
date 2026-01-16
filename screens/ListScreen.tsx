import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Swipeable } from 'react-native-gesture-handler';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

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

  const showDeleteConfirm = (id: string) => {
    setTodoToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      setTodos(todos.filter((todo) => todo.id !== todoToDelete));
    }
    setDeleteConfirmVisible(false);
    setTodoToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setTodoToDelete(null);
  };

  // 导出数据
  const exportData = async () => {
    try {
      const dataStr = JSON.stringify(todos, null, 2);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hermit-pad-todos.json';
        a.click();
        URL.revokeObjectURL(url);
        Alert.alert('成功', '数据已导出');
      } else {
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

      const isValid = parsedData.every(
        (item: any) =>
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

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    item: Todo
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.swipeActionContainer,
          { transform: [{ translateX: trans }] },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => showDeleteConfirm(item.id)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#f4665e" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    item: Todo
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [-80, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.swipeActionContainer,
          { transform: [{ translateX: trans }] },
        ]}
      >
        <TouchableOpacity
          style={styles.completeAction}
          onPress={() => toggleTodo(item.id)}
        >
          <MaterialIcons 
            name={item.completed ? "remove-done" : "done-all"} 
            size={24} 
            color={item.completed ? "#999" : "#4CAF50"}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTodoItem = ({ item, drag, isActive }: RenderItemParams<Todo>) => {
    const itemIndex = todos.findIndex(t => t.id === item.id);
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === todos.length - 1;

    return (
      <ScaleDecorator>
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, item)
          }
          renderLeftActions={(progress, dragX) =>
            renderLeftActions(progress, dragX, item)
          }
          overshootRight={false}
          overshootLeft={false}
          rightThreshold={40}
          leftThreshold={40}
        >
          <View
            style={[
              styles.todoItem,
              isActive && styles.todoItemActive,
            ]}
          >
            <TouchableOpacity
              style={styles.todoTextContainer}
              activeOpacity={0.7}
              onLongPress={Platform.OS !== 'web' ? drag : undefined}
              disabled={isActive}
            >
              <Text
                style={[
                  styles.todoTitle,
                  item.completed && styles.todoTitleCompleted,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          </View>
        </Swipeable>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="添加新的待办事项..."
          placeholderTextColor="#999"
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={addTodo}
          returnKeyType="done"
        />
      </View>

      <DraggableFlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setTodos(data)}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无待办事项</Text>
          </View>
        }
      />

      {/* 礼物图标按钮 */}
      <TouchableOpacity
        style={styles.giftButton}
        onPress={() => setShowSettings(true)}
      >
        <MaterialIcons name="settings" size={24} color="black" />
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

      {/* 删除确认弹窗 */}
      <Modal
        visible={deleteConfirmVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIconContainer}>
              <MaterialIcons name="delete-outline" size={40} color="#FF3B30" />
            </View>
            <Text style={styles.deleteModalTitle}>确认删除事件</Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={cancelDelete}
              >
                <Text style={styles.deleteModalCancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalConfirmText}>确认</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  input: {
    height: 45,
    fontSize: 16,
    color: '#000',
  },
  listContainer: {
    paddingBottom: 100,
  },
  todoItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  todoItemActive: {
    backgroundColor: '#f5f5f5',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 18,
    color: '#000',
    lineHeight: 24,
  },
  todoTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  webDragControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  dragButton: {
    padding: 4,
  },
  dragButtonDisabled: {
    opacity: 0.3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#ccc',
  },
  // 礼物按钮样式
  giftButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  giftIcon: {
    fontSize: 28,
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
  // 滑动操作样式
  swipeActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  completeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  // 删除确认弹窗样式
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  deleteModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
  },
  deleteModalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  deleteModalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  deleteModalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  deleteModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
