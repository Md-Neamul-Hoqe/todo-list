import Loader from "../../components/Loader";
import moment from "moment-timezone";
import useGetTasks from "../../Hooks/useGetTasks";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useAuth from "../../Hooks/useAuth";
import SelectStatus from "../../components/SelectStatus";
import Swal from "sweetalert2";
import SearchResult from "../../components/SearchResult";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdAddCircleOutline } from "react-icons/md";
import { Helmet } from "react-helmet-async";
import "moment-timezone";

const Home = () => {
  const {
    handleDeleteTask,
    handleNotification,
    refetchNotification,
    headings,
  } = useAuth();

  const axios = useAxiosHook();
  const [todoList, isPendingToDoList, isLoadingToDoList, refetch] =
    useGetTasks(0);

  const handleCompletedTask = (_id, title, status, email) => {
    if (status !== "completed") {
      axios
        .patch(`/update-tasks/${_id}`, {
          status: "completed",
        })
        .then(async (res) => {
          if (res?.data?.modifiedCount) {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "info",
              title: `'${title}' is times up.`,
            });

            handleNotification({
              title,
              status: "completed",
              email,
            });

            refetchNotification();
            await refetch();
          }
        });
    }
  };

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquer Your To-Do List
      </h2>

      <SearchResult />

      <div>
        {!isPendingToDoList && !isLoadingToDoList ? (
          Array.isArray(todoList) ? (
            todoList?.length > 0 ? (
              <div className="overflow-x-auto md:m-10 text-right">
                <div className="flex items-center justify-end gap-2 capitalize mb-2 text-sm">
                  <Link
                    to="/add-new-task"
                    className="btn bg-green-700 text-white">
                    <MdAddCircleOutline /> New Task
                  </Link>
                  <Link
                    to="/history"
                    className="btn bg-info text-white">
                    completed tasks
                  </Link>
                </div>
                <table className="table table-zebra-zebra">
                  {/* head */}
                  <thead className="bg-green-50">{headings}</thead>
                  <tbody>
                    {todoList?.map(
                      (
                        { _id, title, description, status, date, email },
                        index
                      ) => (
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
                                if (this.isAfter(now)) {
                                  /* change status from pending to running */
                                  if (status !== "running") {
                                    axios
                                      .patch(`/update-tasks/${_id}`, {
                                        status: "running",
                                      })
                                      .then(async (res) => {
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
                                            email,
                                          });

                                          const difference = moment
                                            .duration(moment(this).diff(now))
                                            .asSeconds();

                                          setTimeout(
                                            refetchNotification,
                                            difference > 0 ? difference : 0
                                          );

                                          await refetch();
                                          await refetchNotification();
                                        }
                                      });
                                  }
                                  return "[Will Happen Today]";
                                } else {
                                  /* change status running to completed */
                                  handleCompletedTask(
                                    _id,
                                    title,
                                    status,
                                    email
                                  );

                                  return "[Happened Today]";
                                }
                              },
                              nextDay: "[Tomorrow]",
                              nextWeek: "[Next] dddd",
                              lastDay: function () {
                                handleCompletedTask(_id, title, status, email);
                                return "[Yesterday]";
                              },
                              lastWeek: function () {
                                handleCompletedTask(_id, title, status, email);
                                return "[Last] dddd";
                              },
                              sameElse: function () {
                                return "DD/MM/YYYY";
                              },
                            })}
                            {/* {moment().to(date)} */}
                          </td>
                          <th>
                            <button
                              onClick={() => {
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
              <div className="contentCenter min-h-[calc(100vh/2)] text-xl flex-col gap-5">
                Please add new task to see the tasks here.
                <Link
                  to="/add-new-task"
                  className="btn bg-green-700 text-white text-sm mb-2">
                  <MdAddCircleOutline /> New Task
                </Link>
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
      <Helmet>
        <title>To-Do List | Home</title>
      </Helmet>
    </div>
  );
};

export default Home;
