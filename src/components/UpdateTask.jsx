import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useGetTasks from "../Hooks/useGetTasks";
import useAxiosHook from "../Hooks/useAxiosHook";
import Swal from "sweetalert2";

const UpdateTask = ({ id, updatedTask }) => {
  const axiosSecure = useAxiosHook();
  const navigate = useNavigate();
  const [, , , refetch] = useGetTasks();
  
  console.log(id, updatedTask);

  try {
    axiosSecure
      .patch(`/update-tasks/${id}`, updatedTask)
      .then((res) => {
        if (res?.data?.modifiedCount) {
          refetch();

          console.log(res?.data);

          Swal.fire({
            icon: "success",
            title: "Schedule Updated.",
            showConfirmButton: false,
            timer: 1500,
          });

          return navigate("/");
        }
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

UpdateTask.propTypes = {
  id: PropTypes.string,
  updatedTask: PropTypes.object,
};

export default UpdateTask;
