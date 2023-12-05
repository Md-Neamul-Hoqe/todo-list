"use client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useGetTasks from "../../Hooks/useGetTasks";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";

const EditTask = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const axiosSecure = useAxiosHook();
  const [, , , refetch] = useGetTasks();

  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();

  const {
    data: task = {},
    isPending,
    isLoading,
    refetch: refetchTask,
  } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ["single-task", user?.email],
    queryFn: async () => {
      if (user?.email) {
        const res = await axiosSecure.get(
          `/single-task/${id}?email=${user?.email}`
        );

        return res?.data;
      }
    },
  });

  if ((!isPending && !task?.title) || !task?.description || !task?.date)
    refetchTask();

  const onSubmit = (data) => {
    // console.log(data);

    const { title, description, date } = data;

    const updatedTodo = { title, description, date, status: "pending" };

    // console.log(updatedTodo);

    try {
      axiosSecure.patch(`/update-tasks/${id}`, updatedTodo).then((res) => {
        if (res?.data?.modifiedCount) {
          refetch();

          Swal.fire({
            icon: "success",
            title: "Schedule Updated.",
            showConfirmButton: true,
          });

          return navigate("/");
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error?.message,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-5xl font-mono font-semibold text-center my-10">
        Edit The Task
      </h1>
      {isPending || isLoading ? (
        <div className="contentCenter min-h-[calc(100vh/3)]">
          <Loader />
        </div>
      ) : Object?.keys(task) ? (
        Object?.keys(task)?.length > 0 ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                defaultValue={task?.title}
                {...register("title", {
                  maxLength: 100,
                  required: true,
                })}
                type="text"
                placeholder="Set a clear and understandable title."
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                type="text"
                placeholder="Set description."
                className="textarea textarea-bordered"
                defaultValue={task?.description}
                {...register("description")}
                rows={10}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <input
                type="datetime-local"
                placeholder="Set time"
                className="input input-bordered"
                defaultValue={task?.date}
                {...register("date", {
                  min: moment.min(moment().startOf("second")),
                  required: true,
                })}
              />
            </div>
            <div className="form-control">
              <input
                type="submit"
                className="my-5 btn bg-green-700 text-white"
                value={"Submit"}
              />
            </div>
          </form>
        ) : (
          // todoList?.map(todo => )
          <div className="contentCenter min-h-[calc(100vh/3)]">
            No Data Found
          </div>
        )
      ) : (
        <div className="contentCenter min-h-[calc(100vh/3)]">
          Something Wrong
        </div>
      )}
    </div>
  );
};

EditTask.propTypes = {
  task: PropTypes.object,
};

export default EditTask;
