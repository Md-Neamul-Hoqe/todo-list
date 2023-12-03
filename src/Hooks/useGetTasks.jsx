import { useQuery } from "@tanstack/react-query";
import useAxiosHook from "./useAxiosHook";

const useGetTasks = (status = "all") => {
  const axiosSecure = useAxiosHook();
  const api = status === "completed" ? "/completed-tasks" : "/tasks";

  // console.log(!status, api);

  const {
    data: todoList = [],
    isPending,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`${status === "completed" ? status : "todoList"}`],
    queryFn: async () => {
      const result = await axiosSecure.get(api);

      // console.log(result?.data);
      return result?.data;
    },
  });

  return [todoList, isPending, isLoading, refetch];
};

export default useGetTasks;
