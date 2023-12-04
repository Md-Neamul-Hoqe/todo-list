"use client";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useGetTasks from "../../Hooks/useGetTasks";
import Swal from "sweetalert2";

const EditTask = () => {
  const axiosSecure = useAxiosHook();
  const [, , , refetch] = useGetTasks();
  const task = useLoaderData();
  const { id } = useParams();

  const navigate = useNavigate();

  const { handleSubmit, register } = useForm({
    defaultValues: {
      title: task?.title,
      description: task?.description,
      date: task?.date,
    },
  });

  const onSubmit = (data) => {
    // console.log(data);

    const { title, description, date } = data;

    const updatedTodo = { title, description, date, status: "pending" };

    // console.log(updatedTodo);

    try {
      axiosSecure
        .patch(`/update-tasks/${id}`, updatedTodo)
        .then((res) => {
          if (res?.data?.modifiedCount) {
            refetch();

            Swal.fire({
              icon: "success",
              title: "Schedule Updated.",
              showConfirmButton: true,
            });

            return navigate("/");
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-5xl font-mono font-semibold text-center my-10">
        Edit The Task
      </h1>
      {Object?.keys(task) ? (
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
