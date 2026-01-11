export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

export type RootStackParamList = {
  List: undefined;
  Detail: {
    todo: Todo;
    updateTodo: (todo: Todo) => void;
  };
};
