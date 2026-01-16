import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Todo } from '../types';
import { detailModalStyles } from '../styles/listScreen.styles';

interface DetailModalProps {
  visible: boolean;
  todo: Todo | null;
  editingTitle: string;
  newSubtaskTitle: string;
  editingSubtaskId: string | null;
  editingSubtaskText: string;
  onClose: () => void;
  onTitleChange: (text: string) => void;
  onTitleBlur: () => void;
  onNewSubtaskChange: (text: string) => void;
  onAddSubtask: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onStartEditSubtask: (subtask: Todo) => void;
  onEditSubtaskTextChange: (text: string) => void;
  onFinishEditSubtask: () => void;
  onUpdateSubtaskOrder: (newSubtasks: Todo[]) => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  visible,
  todo,
  editingTitle,
  newSubtaskTitle,
  editingSubtaskId,
  editingSubtaskText,
  onClose,
  onTitleChange,
  onTitleBlur,
  onNewSubtaskChange,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onStartEditSubtask,
  onEditSubtaskTextChange,
  onFinishEditSubtask,
  onUpdateSubtaskOrder,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity
        style={detailModalStyles.detailModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={detailModalStyles.detailModal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={detailModalStyles.detailModalHandle} />

          <ScrollView style={detailModalStyles.detailContent} showsVerticalScrollIndicator={false}>
            <TextInput
              style={detailModalStyles.detailTitleInput}
              value={editingTitle}
              onChangeText={onTitleChange}
              onBlur={onTitleBlur}
              placeholder="标题"
              placeholderTextColor="#999"
              multiline
            />

            <View style={detailModalStyles.detailDescriptionContainer}>
              <MaterialIcons
                name="description"
                size={20}
                color="#ccc"
                style={detailModalStyles.descriptionIcon}
              />
              <TextInput
                style={detailModalStyles.detailDescriptionInput}
                placeholder="描述"
                placeholderTextColor="#ccc"
                editable={false}
                multiline
              />
            </View>

            <View style={detailModalStyles.subtasksSection}>
              {todo?.subtasks && todo.subtasks.length > 0 && (
                <DraggableFlatList
                  data={todo.subtasks}
                  onDragEnd={({ data }) => onUpdateSubtaskOrder(data)}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, drag, isActive }) => (
                    <ScaleDecorator>
                      <View
                        style={[
                          detailModalStyles.subtaskItem,
                          isActive && detailModalStyles.subtaskItemActive,
                        ]}
                      >
                        <TouchableOpacity
                          onPress={() => onToggleSubtask(item.id)}
                          style={detailModalStyles.subtaskCheckbox}
                        >
                          <MaterialIcons
                            name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                            size={24}
                            color={item.completed ? '#34C759' : '#ccc'}
                          />
                        </TouchableOpacity>

                        {editingSubtaskId === item.id ? (
                          <TextInput
                            style={[
                              detailModalStyles.subtaskTextInput,
                              item.completed && detailModalStyles.subtaskTextCompleted,
                            ]}
                            value={editingSubtaskText}
                            onChangeText={onEditSubtaskTextChange}
                            onBlur={onFinishEditSubtask}
                            autoFocus
                            multiline
                          />
                        ) : (
                          <TouchableOpacity
                            style={detailModalStyles.subtaskTextContainer}
                            onPress={() => onStartEditSubtask(item)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                detailModalStyles.subtaskText,
                                item.completed && detailModalStyles.subtaskTextCompleted,
                              ]}
                            >
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {editingSubtaskId === item.id ? (
                          <TouchableOpacity
                            onPress={() => onDeleteSubtask(item.id)}
                            style={detailModalStyles.subtaskAction}
                          >
                            <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onLongPress={drag}
                            disabled={isActive}
                            style={detailModalStyles.subtaskAction}
                          >
                            <MaterialIcons name="drag-indicator" size={20} color="#ccc" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </ScaleDecorator>
                  )}
                  scrollEnabled={false}
                />
              )}

              <View style={detailModalStyles.addSubtaskContainer}>
                <TouchableOpacity style={detailModalStyles.subtaskCheckbox}>
                  <MaterialIcons name="check-box-outline-blank" size={24} color="#ccc" />
                </TouchableOpacity>
                <TextInput
                  style={detailModalStyles.addSubtaskInput}
                  value={newSubtaskTitle}
                  onChangeText={onNewSubtaskChange}
                  onSubmitEditing={onAddSubtask}
                  placeholder="添加子列表"
                  placeholderTextColor="#ccc"
                  returnKeyType="done"
                />
              </View>
            </View>
          </ScrollView>

          <View style={detailModalStyles.detailActions}>
            <TouchableOpacity style={detailModalStyles.detailActionButton} onPress={onDelete}>
              <MaterialIcons name="delete-outline" size={26} color="#666" />
              <Text style={detailModalStyles.detailActionText}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity style={detailModalStyles.detailActionButton}>
              <MaterialIcons name="edit" size={26} color="#666" />
              <Text style={detailModalStyles.detailActionText}>编辑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={detailModalStyles.detailActionButton}>
              <MaterialIcons name="timer" size={26} color="#666" />
              <Text style={detailModalStyles.detailActionText}>计时</Text>
            </TouchableOpacity>
            <TouchableOpacity style={detailModalStyles.detailActionButton} onPress={onToggleComplete}>
              <MaterialIcons
                name={todo?.completed ? 'replay' : 'check-circle'}
                size={26}
                color="#666"
              />
              <Text style={detailModalStyles.detailActionText}>完成</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
