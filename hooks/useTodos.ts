import { useState, useEffect } from 'react';
import { Todo } from '../types';
import { loadTodos as loadTodosFromStorage, saveTodos as saveTodosToStorage } from '../utils/storage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveTodosToStorage(todos);
    }
  }, [todos, isLoading]);

  const loadTodos = async () => {
    const loadedTodos = await loadTodosFromStorage();
    setTodos(loadedTodos);
    setIsLoading(false);
  };

  const addTodo = (title: string): boolean => {
    if (title.trim() === '') {
      return false;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      subtasks: [],
    };

    setTodos([newTodo, ...todos]);
    return true;
  };

  const toggleTodo = (id: string) => {
    const newTodo = todos.find((todo) => todo.id === id);
    if (!newTodo) return;
    const newStatus = !newTodo.completed;
    newTodo.completed = newStatus;
    newTodo.subtasks?.forEach((subtask) => {
      subtask.completed = newStatus;
    });

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: newTodo.completed, subtasks: newTodo.subtasks } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateTodoOrder = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const updateTodoTitle = (id: string, newTitle: string) => {
    if (newTitle.trim() === '') return;
    
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle.trim() } : todo
      )
    );
  };

  const addSubtask = (todoId: string, subtaskTitle: string): boolean => {
    if (subtaskTitle.trim() === '') return false;

    const newSubtask: Todo = {
      id: `${todoId}-${Date.now()}`,
      title: subtaskTitle.trim(),
      completed: false,
      subtasks: [],
    };

    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? { ...todo, subtasks: [...(todo.subtasks || []), newSubtask] }
          : todo
      )
    );

    return true;
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: (todo.subtasks || []).map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : todo
      )
    );
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: (todo.subtasks || []).filter((st) => st.id !== subtaskId),
            }
          : todo
      )
    );
  };

  const updateSubtaskTitle = (todoId: string, subtaskId: string, newTitle: string) => {
    if (newTitle.trim() === '') return;

    setTodos(
      todos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              subtasks: (todo.subtasks || []).map((st) =>
                st.id === subtaskId ? { ...st, title: newTitle.trim() } : st
              ),
            }
          : todo
      )
    );
  };

  const updateSubtaskOrder = (todoId: string, newSubtasks: Todo[]) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, subtasks: newSubtasks } : todo
      )
    );
  };

  const importTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const toggleAllSubtasks = (todoId: string, completed: boolean) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: (todo.subtasks || []).map((st) => ({ ...st, completed })),
          };
        }
        return todo;
      })
    );
  };

  return {
    todos,
    isLoading,
    addTodo,
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
    toggleAllSubtasks,
  };
};
