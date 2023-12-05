import Select from "react-select";
import PropTypes from "prop-types";
import useAxiosHook from "../Hooks/useAxiosHook";
import useGetTasks from "../Hooks/useGetTasks";
import Swal from "sweetalert2";

const options = [
  { value: "pending", label: "Pending" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
];

const SelectStatus = ({ task, id }) => {
  // console.log({ task, id });
  const axiosSecure = useAxiosHook();
  const [, , , refetch] = useGetTasks(0);

  const UpdateStatus = (status) => {
    // console.log(status);

    try {
      axiosSecure
        .patch(`/update-tasks/${id}`, { status: status?.value })
        .then((res) => {
          if (res?.data?.modifiedCount) {
            // console.log("Changed by user: ", res?.data);

            Swal.fire({
              icon: "success",
              title: "Schedule Updated.",
              showConfirmButton: false,
              timer: 1500,
            });

            refetch();
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
    <div>
      <Select
        options={options}
        defaultValue={{
          value: task?.value,
          label: task?.label,
        }}
        onChange={UpdateStatus}
      />
    </div>
  );
};

SelectStatus.propTypes = {
  task: PropTypes.object,
  id: PropTypes.string,
};

export default SelectStatus;
