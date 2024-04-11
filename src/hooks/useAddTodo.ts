import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../react-query/constants";
import todoService,  { Todo } from "../services/todoService";
interface AddTodoContext {
    previousTodos: Todo[] | undefined;
  
}


const useAddTodo = (onAdd : () => void) => {
    const queryClient = useQueryClient();
    return useMutation<Todo, Error, Todo, AddTodoContext>({
      mutationFn: (todo: Todo) => todoService.post(todo),
      
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