import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useId } from "react";

interface PostQuery {
    pageSize: number;
  
}
interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
  }

   const usePosts = (query : PostQuery) => { 
   
        return useInfiniteQuery<Post[], Error>( {
            queryKey: ['posts', query],
            queryFn: ({ pageParam=1}) => axios
            .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
              params: { _start: (pageParam - 1) * query.pageSize, _limit: query.pageSize},
            
            })
            .then((res) => res.data) ,
            staleTime: 1000 * 10,
            keepPreviousData: true,
            getNextPageParam: (lastPage: Post[], allPages: Post[][]) => {
                    return lastPage.length > 0 ? allPages.length + 1 : undefined;
        }});
  }

  export default usePosts;


