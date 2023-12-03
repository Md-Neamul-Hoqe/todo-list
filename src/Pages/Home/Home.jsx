import Loader from "../../components/Loader";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import "moment-timezone";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import useGetTasks from "../../Hooks/useGetTasks";
import useAxiosHook from "../../Hooks/useAxiosHook";
import { MdAddCircleOutline } from "react-icons/md";
import useAuth from "../../Hooks/useAuth";
import SelectStatus from "../../components/SelectStatus";
import { useEffect } from "react";
import Swal from "sweetalert2";

const Home = () => {
  const { handleDeleteTask, notification, headings } = useAuth();

  const axios = useAxiosHook();

  /* Notify someone about their tasks for today. */
  useEffect(() => {
    if (notification) {
      Swal.fire({
        icon: "info",
        html: notification,
        showConfirmButton: true,
      });
    }
  }, [notification]);


  const [todoList, isPending, isLoading, refetch] = useGetTasks(0);

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquer Your To-Do List
      </h2>

      <div>
        {!isPending && !isLoading ? (
          Array.isArray(todoList) ? (
            todoList?.length > 0 ? (
              <div className="overflow-x-auto md:mx-10 text-right">
                <Link
                  to="/add-new-task"
                  className="btn bg-green-700 text-white text-sm mb-2">
                  <MdAddCircleOutline /> New Task
                </Link>
                <table className="table table-zebra-zebra">
                  {/* head */}
                  <thead>{headings}</thead>
                  <tbody>
                    {todoList?.map(
                      ({ _id, title, description, status, date }, index) => (
                        <tr key={_id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="font-bold">{title}</div>
                          </td>
                          <td>{description}</td>
                          <td>
                            {moment(date).format("dddd, MMMM D, YY, h:mm a")}
                          </td>
                          <td
                            className={
                              status === "running"
                                ? "text-green-700 font-semibold"
                                : ""
                            }>
                            <SelectStatus
                              id={_id}
                              defaultValue={{
                                value: status,
                                label:
                                  status.charAt(0).toUpperCase() +
                                  status.slice(1),
                              }}
                            />{" "}
                            <br />
                            {moment(date).calendar(null, {
                              sameDay: function (now) {
                                if (this.isAfter(now)) {
                                  /* change status from pending to running */
                                  axios
                                    .patch(`/update-tasks/${_id}`, {
                                      status: "running",
                                    })
                                    .then((res) => {
                                      refetch();
                                      if (res?.data?.modifiedCount) {
                                        const Toast = Swal.mixin({
                                          toast: true,
                                          position: "top-end",
                                          showConfirmButton: false,
                                          timer: 2000,
                                          timerProgressBar: true,
                                          didOpen: (toast) => {
                                            toast.addEventListener(
                                              "mouseenter",
                                              Swal.stopTimer
                                            );
                                            toast.addEventListener(
                                              "mouseleave",
                                              Swal.resumeTimer
                                            );
                                          },
                                        });

                                        Toast.fire({
                                          icon: "info",
                                          title: `'${title}' is now running task.`,
                                        });

                                        return "[Will Happen Today]";
                                      }
                                    });
                                } else {
                                  /* change status running to completed */
                                  axios
                                    .patch(`/update-tasks/${_id}`, {
                                      status: "completed",
                                    })
                                    .then((res) => {
                                      refetch();
                                      if (res?.data?.modifiedCount) {
                                        const Toast = Swal.mixin({
                                          toast: true,
                                          position: "top-end",
                                          showConfirmButton: false,
                                          timer: 2000,
                                          timerProgressBar: true,
                                          didOpen: (toast) => {
                                            toast.addEventListener(
                                              "mouseenter",
                                              Swal.stopTimer
                                            );
                                            toast.addEventListener(
                                              "mouseleave",
                                              Swal.resumeTimer
                                            );
                                          },
                                        });

                                        Toast.fire({
                                          icon: "info",
                                          title: `'${title}' is completed.`,
                                        });

                                        return "[Will Happen Today]";
                                      }
                                    });
                                }
                              },
                              nextDay: "[Tomorrow]",
                              nextWeek: "dddd",
                              lastDay: "[Yesterday]",
                              lastWeek: "[Last] dddd",
                              sameElse: "DD/MM/YYYY",
                            })}
                            {/* {moment().to(date)} */}
                          </td>
                          <th>
                            <button
                              onClick={() => {
                                console.log(title);
                                return handleDeleteTask(_id, refetch);
                              }}
                              className="btn btn-ghost btn-xs text-xl text-error">
                              <FaTrashCan />
                            </button>
                            <Link
                              to={`/manage-task/${_id}`}
                              className="btn btn-ghost btn-xs text-xl text-info">
                              <FaEdit />
                            </Link>
                          </th>
                        </tr>
                      )
                    )}
                  </tbody>
                  {/* foot */}
                  <tfoot>{headings}</tfoot>
                </table>
              </div>
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
          )
        ) : (
          <Loader ratio={2} />
        )}
      </div>
    </div>
  );
};

export default Home;
