import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
  const { todo, updateTodo } = route.params;
  const [title, setTitle] = useState<string>(todo.title);
  const [description, setDescription] = useState<string>(todo.description || '');
  const [completed, setCompleted] = useState<boolean>(todo.completed);

  const handleSave = () => {
    if (title.trim() === '') {
      Alert.alert('提示', '标题不能为空');
      return;
    }

    const updatedTodo = {
      ...todo,
      title: title.trim(),
      description: description.trim(),
      completed,
    };

    updateTodo(updatedTodo);
    Alert.alert('成功', '待办事项已保存', [
      { text: '确定', onPress: () => navigation.goBack() },
    ]);
  };

  const toggleCompleted = () => {
    setCompleted(!completed);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>待办详情</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>标题</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="输入标题..."
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>描述</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="输入详细描述..."
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>状态</Text>
          <TouchableOpacity
            style={styles.statusContainer}
            onPress={toggleCompleted}
          >
            <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
              {completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.statusText}>
              {completed ? '已完成' : '未完成'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
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
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    minHeight: 40,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  descriptionInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    padding: 15,
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
