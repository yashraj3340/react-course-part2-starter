import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostQuery {
    page: number;
    pageSize: number;
  
}
interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

   const usePosts = (query : PostQuery) => { 
    const FetchPosts = () =>
        axios
          .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
            params: { _start: (query.page - 1) * query.pageSize, _limit: query.pageSize},
          
          })
          .then((res) => res.data);
    
          return useQuery<Post[], Error>({
            queryKey:['posts',query],
            queryFn: FetchPosts,
            staleTime: 1000 * 10,
            keepPreviousData: true,
          });
  }

  export default usePosts;