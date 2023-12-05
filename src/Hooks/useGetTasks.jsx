import { useQuery } from "@tanstack/react-query";
import useAxiosHook from "./useAxiosHook";
import useAuth from "./useAuth";

const useGetTasks = (status = "all") => {
  const { user } = useAuth();

  const axiosSecure = useAxiosHook();

  const api =
    status === "completed" && !!user?.email
      ? `/completed-tasks?email=${user?.email}`
      : `/tasks?email=${user?.email}`;

  const {
    data: todoList = [],
    isPending: isPendingToDoList,
    isLoading: isLoadingToDoList,
    refetch,
  } = useQuery({
    enabled: !!user?.email,
    queryKey: [`${status === "completed" ? status : "todoList"}`, user?.email],
    queryFn: async () => {
      if (user?.email) {
        const result = await axiosSecure.get(api);

        // console.log(result?.data);
        return result?.data;
      }
    },
  });

  return [todoList, isPendingToDoList, isLoadingToDoList, refetch];
};

export default useGetTasks;
