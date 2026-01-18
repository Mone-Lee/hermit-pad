import React from 'react';
import { View, TouchableOpacity, Text, Platform, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Todo } from '../types';
import { todoItemStyles } from '../styles/listScreen.styles';

interface TodoItemProps {
  item: Todo;
  drag: () => void;
  isActive: boolean;
  onPress: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  item,
  drag,
  isActive,
  onPress,
  onDelete,
  onToggle,
}) => {
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={todoItemStyles.swipeActionContainer}>
        <Animated.View style={[todoItemStyles.deleteAction, { transform: [{ scale }] }]}>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <MaterialIcons name="delete-outline" size={24} color="#f0726b" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderLeftActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={todoItemStyles.swipeActionContainer}>
        <Animated.View style={[todoItemStyles.completeAction, { transform: [{ scale }] }]}>
          <TouchableOpacity onPress={() => onToggle(item.id)}>
            <MaterialIcons
              name={item.completed ? 'remove-done' : 'done-all'}
              size={24}
              color={item.completed ? '#999' : '#4CAF50'}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const completedCount = item.subtasks?.filter((st) => st.completed).length || 0;
  const totalCount = item.subtasks?.length || 0;

  return (
    <ScaleDecorator>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={[todoItemStyles.todoItem, isActive && todoItemStyles.todoItemActive]}>
          <TouchableOpacity
            style={todoItemStyles.todoTextContainer}
            activeOpacity={0.7}
            onPress={() => onPress(item)}
            onLongPress={Platform.OS !== 'web' ? drag : undefined}
            disabled={isActive}
          >
            <Text
              style={[
                todoItemStyles.todoTitle,
                item.completed && todoItemStyles.todoTitleCompleted,
              ]}
            >
              {item.title}
            </Text>
            {totalCount > 0 && (
              <Text style={todoItemStyles.subtaskCount}>
                {completedCount}/{totalCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Swipeable>
    </ScaleDecorator>
  );
};
