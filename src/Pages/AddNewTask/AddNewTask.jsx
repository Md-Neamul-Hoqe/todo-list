import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useGetTasks from "../../Hooks/useGetTasks";
import Swal from "sweetalert2";
import moment from "moment";
import useAuth from "../../Hooks/useAuth";

const AddNewTask = () => {
  const axiosSecure = useAxiosHook();
  const [, , , refetch] = useGetTasks();
  const { user } = useAuth();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // console.log(data);

    const { title, description, date } = data;

    const newTask = {
      title,
      description,
      date,
      status: "pending",
      email: user?.email,
    };

    // console.log(newTask);

    try {
      axiosSecure.post(`/create-task`, newTask).then((res) => {
        if (res?.data?.insertedId) {
          refetch();

          // console.log(res?.data);

          Swal.fire({
            icon: "success",
            title: "Schedule Added.",
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
        Add A New Task
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            {...register("title", {
              maxLength: 100,
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
            })}
          />
          {errors?.date && <span>No past date allowed.</span>}
        </div>
        <div className="form-control">
          <input
            type="submit"
            className="my-5 btn bg-green-700 text-white"
            value={"Submit"}
          />
        </div>
      </form>
    </div>
  );
};

AddNewTask.propTypes = {
  task: PropTypes.object,
};

export default AddNewTask;
