import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Todo } from "./useTodos";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Todo>("/todos");

interface AddTodoContext {
    previousTodos: Todo[] | undefined;
  }
  
const useAddTodo = (onAdd : () => void) => {
    const queryClient = useQueryClient();
    return useMutation<Todo, Error, Todo, AddTodoContext>({
      mutationFn: (todo: Todo) => apiClient.post(todo),
      
      onMutate: (newTodo: Todo) => {
        const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS || []);
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos= []) => [
          newTodo,
          ...todos ,
        ]);

        onAdd();
       
  
        return { previousTodos };
      },
      onSuccess: (savedTodo, newTodo) => {
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (todos) =>
          todos?.map((todo) => (todo.id === 0 ? savedTodo : todo))
        );
      },
      onError: (error, newTodo, context) => {
        if (!context) return;
        queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos);
      },
    });
} 

export default useAddTodo;