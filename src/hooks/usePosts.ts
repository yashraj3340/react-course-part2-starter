import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

  export const usePosts = () => { 
    const FetchPosts = () =>
        axios
          .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
          .then((res) => res.data);
    
          return useQuery<Post[], Error>({
            queryKey: ["posts"],
            queryFn: FetchPosts,
            staleTime: 1000 * 10,
          });
  }

  export default usePosts;