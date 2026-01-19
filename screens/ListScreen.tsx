import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import * as Clipboard from 'expo-clipboard';
import { Todo } from '../types';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from '../components/TodoItem';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { DetailModal } from '../components/DetailModal';
import { SettingsModal } from '../components/SettingsModal';
import { ImportModal } from '../components/ImportModal';
import { listScreenStyles } from '../styles/listScreen.styles';

export default function ListScreen() {
  const {
    todos,
    isLoading,
    addTodo: addTodoToList,
    toggleTodo,
    deleteTodo,
    updateTodoOrder,
    updateTodoTitle,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateSubtaskTitle,
    updateSubtaskOrder,
    importTodos,
  } = useTodos();

  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>('');
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskText, setEditingSubtaskText] = useState<string>('');

  const handleAddTodo = () => {
    if (addTodoToList(newTodoTitle)) {
      setNewTodoTitle('');
    } else {
      Alert.alert('提示', '请输入待办事项标题');
    }
  };

  const showDeleteConfirm = (id: string) => {
    setTodoToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      deleteTodo(todoToDelete);
      setTodoToDelete(null);
    }
    setDeleteConfirmVisible(false);
  };

  const cancelDelete = () => {
    setTodoToDelete(null);
    setDeleteConfirmVisible(false);
  };

  const openDetailModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setEditingTitle(todo.title);
    setNewSubtaskTitle('');
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedTodo(null);
    setEditingTitle('');
    setNewSubtaskTitle('');
    setEditingSubtaskId(null);
    setEditingSubtaskText('');
  };

  const handleUpdateTodoTitle = () => {
    if (selectedTodo && editingTitle.trim() !== '') {
      updateTodoTitle(selectedTodo.id, editingTitle);
      setSelectedTodo({ ...selectedTodo, title: editingTitle.trim() });
    }
  };

  const handleAddSubtask = () => {
    if (selectedTodo && newSubtaskTitle.trim() !== '') {
      const newSubtask: Todo = {
        id: `${selectedTodo.id}-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
        subtasks: [],
      };
      
      addSubtask(selectedTodo.id, newSubtaskTitle);
      setSelectedTodo({
        ...selectedTodo,
        subtasks: [...(selectedTodo.subtasks || []), newSubtask],
      });
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (selectedTodo) {
      toggleSubtask(selectedTodo.id, subtaskId);
      setSelectedTodo({
        ...selectedTodo,
        subtasks: (selectedTodo.subtasks || []).map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ),
      });
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (selectedTodo) {
      deleteSubtask(selectedTodo.id, subtaskId);
      setSelectedTodo({
        ...selectedTodo,
        subtasks: (selectedTodo.subtasks || []).filter((st) => st.id !== subtaskId),
      });
    }
  };

  const startEditingSubtask = (subtask: Todo) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskText(subtask.title);
  };

  const finishEditingSubtask = () => {
    if (selectedTodo && editingSubtaskId && editingSubtaskText.trim() !== '') {
      updateSubtaskTitle(selectedTodo.id, editingSubtaskId, editingSubtaskText);
      setSelectedTodo({
        ...selectedTodo,
        subtasks: (selectedTodo.subtasks || []).map((st) =>
          st.id === editingSubtaskId ? { ...st, title: editingSubtaskText.trim() } : st
        ),
      });
    }
    setEditingSubtaskId(null);
    setEditingSubtaskText('');
  };

  const handleUpdateSubtaskOrder = (newSubtasks: Todo[]) => {
    if (selectedTodo) {
      updateSubtaskOrder(selectedTodo.id, newSubtasks);
      setSelectedTodo({
        ...selectedTodo,
        subtasks: newSubtasks,
      });
    }
  };

  const toggleTodoFromDetail = () => {
    if (selectedTodo) {
      const newCompletedState = !selectedTodo.completed;
      
      // 更新本地状态
      const updatedSubtasks = selectedTodo.subtasks?.map(subtask => ({
        ...subtask,
        completed: newCompletedState
      }));
      
      setSelectedTodo({ 
        ...selectedTodo, 
        completed: newCompletedState,
        subtasks: updatedSubtasks 
      });

      toggleTodo(selectedTodo.id);
    }
  };

  const deleteTodoFromDetail = () => {
    if (selectedTodo) {
      showDeleteConfirm(selectedTodo.id);
      closeDetailModal();
    }
  };

  const exportData = async () => {
    const data = JSON.stringify(todos, null, 2);

    if (Platform.OS === 'web') {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hermit-pad-${new Date().getTime()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      await Clipboard.setStringAsync(data);
      Alert.alert('成功', '数据已复制到剪贴板');
    }

    setShowSettings(false);
  };

  const handleImport = () => {
    setShowSettings(false);
    setShowImportModal(true);
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setImportData(text);
  };

  const confirmImport = () => {
    try {
      const parsed = JSON.parse(importData);
      if (Array.isArray(parsed)) {
        importTodos(parsed);
        Alert.alert('成功', '数据导入成功');
        setShowImportModal(false);
        setImportData('');
      } else {
        Alert.alert('错误', '数据格式不正确');
      }
    } catch (error) {
      Alert.alert('错误', '数据格式不正确，请检查JSON格式');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={listScreenStyles.container}>
        <StatusBar style="dark" />
        <View style={listScreenStyles.emptyContainer}>
          <Text style={listScreenStyles.emptyText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={listScreenStyles.container}>
      <StatusBar style="dark" />

      <View style={listScreenStyles.inputContainer}>
        <TextInput
          style={listScreenStyles.input}
          placeholder="添加新的待办事项..."
          placeholderTextColor="#999"
          value={newTodoTitle}
          onChangeText={setNewTodoTitle}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
        />
      </View>

      {todos.length === 0 ? (
        <View style={listScreenStyles.emptyContainer}>
          <Text style={listScreenStyles.emptyText}>暂无待办事项</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={todos}
          onDragEnd={({ data }) => updateTodoOrder(data)}
          keyExtractor={(item) => item.id}
          renderItem={({ item, drag, isActive }) => (
            <TodoItem
              item={item}
              drag={drag}
              isActive={isActive}
              onPress={openDetailModal}
              onDelete={showDeleteConfirm}
              onToggle={toggleTodo}
            />
          )}
          contentContainerStyle={listScreenStyles.listContainer}
        />
      )}

      <TouchableOpacity
        style={listScreenStyles.settingButton}
        onPress={() => setShowSettings(true)}
      >
        <MaterialIcons name="settings" size={24} color="black" />
      </TouchableOpacity>

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onExport={exportData}
        onImport={handleImport}
      />

      <ImportModal
        visible={showImportModal}
        importData={importData}
        onClose={() => {
          setShowImportModal(false);
          setImportData('');
        }}
        onImportDataChange={setImportData}
        onPaste={pasteFromClipboard}
        onConfirm={confirmImport}
      />

      <DeleteConfirmModal
        visible={deleteConfirmVisible}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <DetailModal
        visible={detailModalVisible}
        todo={selectedTodo}
        editingTitle={editingTitle}
        newSubtaskTitle={newSubtaskTitle}
        editingSubtaskId={editingSubtaskId}
        editingSubtaskText={editingSubtaskText}
        onClose={closeDetailModal}
        onTitleChange={setEditingTitle}
        onTitleBlur={handleUpdateTodoTitle}
        onNewSubtaskChange={setNewSubtaskTitle}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onDeleteSubtask={handleDeleteSubtask}
        onStartEditSubtask={startEditingSubtask}
        onEditSubtaskTextChange={setEditingSubtaskText}
        onFinishEditSubtask={finishEditingSubtask}
        onUpdateSubtaskOrder={handleUpdateSubtaskOrder}
        onDelete={deleteTodoFromDetail}
        onToggleComplete={toggleTodoFromDetail}
      />
    </SafeAreaView>
  );
}
