import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import useAxiosHook from "../../Hooks/useAxiosHook";

const Home = () => {
  const axiosSecure = useAxiosHook();
  const {
    data: todoList,
    isPending,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["todoList"],
    queryFn: async () => {
      const result = await axiosSecure.get("/tasks");

      // console.log(result?.data);
      return result?.data;
    },
  });

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquer Your Todo List
      </h2>

      <div>{!isPending && !isLoading ? "" : <Loader />}</div>
    </div>
  );
};

export default Home;
