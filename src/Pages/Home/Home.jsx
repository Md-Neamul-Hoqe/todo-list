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
import SearchResult from "../../components/SearchResult";

const Home = () => {
  const {
    handleDeleteTask,
    handleNotification,
    runningTask,
    refetchNotification,
    refetchTitles,
    headings,
  } = useAuth();

  const axios = useAxiosHook();

  // console.log(notification, runningTask);

  /* Notify someone about their tasks for today. */
  useEffect(() => {
    window.onload = function () {
      runningTask &&
        Swal.fire({
          icon: "info",
          html: runningTask,
          showConfirmButton: true,
        });
    };
  }, [runningTask]);

  const [todoList, isPending, isLoading, refetch] = useGetTasks(0);

  // Calculate the difference between now and the specific date

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquer Your To-Do List
      </h2>

      <SearchResult />

      <div>
        {!isPending && !isLoading ? (
          Array.isArray(todoList) ? (
            todoList?.length > 0 ? (
              <div className="overflow-x-auto md:m-10 text-right">
                <Link
                  to="/add-new-task"
                  className="btn bg-green-700 text-white text-sm mb-2">
                  <MdAddCircleOutline /> New Task
                </Link>
                <table className="table table-zebra-zebra">
                  {/* head */}
                  <thead className="bg-green-50">{headings}</thead>
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
                              key={status}
                              id={_id}
                              task={{
                                value: status,
                                label:
                                  status.charAt(0).toUpperCase() +
                                  status.slice(1),
                              }}
                            />
                            {moment(date).calendar(null, {
                              sameDay: function (now) {
                                console.log("This :", this, "now: ", now);
                                if (this.isAfter(now)) {
                                  /* change status from pending to running */
                                  if (status !== "running") {
                                    axios
                                      .patch(`/update-tasks/${_id}`, {
                                        status: "running",
                                      })
                                      .then((res) => {
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

                                          handleNotification({
                                            title,
                                            status: "running",
                                          });

                                          const difference = moment
                                            .duration(moment(this).diff(now))
                                            .asSeconds();

                                          setTimeout(
                                            refetchNotification,
                                            difference > 0 ? difference : 0
                                          );

                                          refetch();
                                          refetchNotification();
                                          refetchTitles();
                                        }
                                      });
                                  }
                                  return "[Will Happen Today]";
                                } else {
                                  /* change status running to completed */
                                  axios
                                    .patch(`/update-tasks/${_id}`, {
                                      status: "completed",
                                    })
                                    .then(async (res) => {
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

                                        ("[Will Happen Today]");

                                        await Toast.fire({
                                          icon: "info",
                                          title: `'${title}' is completed.`,
                                        });

                                        handleNotification({
                                          title,
                                          status: "completed",
                                        });

                                        refetchNotification();
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
