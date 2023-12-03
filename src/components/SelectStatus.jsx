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
const SelectStatus = ({ defaultValue, id }) => {
  //   console.log(defaultValue);
  const axiosSecure = useAxiosHook();
  const [, , , refetch] = useGetTasks();

  const UpdateStatus = (status) => {
    // console.log(status);

    try {
      axiosSecure
        .patch(`/update-tasks/${id}`, { status: status?.value })
        .then((res) => {
          if (res?.data?.modifiedCount) {
            refetch();

            // console.log(res?.data);

            Swal.fire({
              icon: "success",
              title: "Schedule Updated.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Select
        options={options}
        // defaultInputValue={defaultValue?.value}
        defaultValue={{
          value: defaultValue?.value,
          label: defaultValue?.label,
        }}
        onChange={UpdateStatus}
      />
    </div>
  );
};

SelectStatus.propTypes = {
  defaultValue: PropTypes.object,
  id: PropTypes.string,
};

export default SelectStatus;
