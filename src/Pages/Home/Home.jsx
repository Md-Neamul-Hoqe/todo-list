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

const Home = () => {
  const { handleDeleteTask } = useAuth();
  const axios = useAxiosHook();

  const headings = (
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Description</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  );

  /* TODO: use hook - dynamic url both all / a todo */

  const [todoList, isPending, isLoading, refetch] = useGetTasks(0);

  const nextDayNotification = (
    <span className="text-orange-700 font-bold">[Tomorrow]</span>
  );

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
                    {todoList?.map((todo, index) => (
                      <tr key={todo?._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="font-bold">{todo?.title}</div>
                        </td>
                        <td>{todo?.description}</td>
                        <td>
                          {moment(todo?.date).format(
                            "dddd, MMMM D, YY, h:mm a"
                          )}
                        </td>
                        <td
                          className={
                            todo?.status === "running"
                              ? "text-green-700 font-semibold"
                              : ""
                          }>
                          {todo?.status} <br />
                          {moment(todo?.date).calendar(null, {
                            sameDay: function (now) {
                              if (this.isAfter(now)) {
                                /* change status to pending to running */
                                axios
                                  .patch(`/update-tasks/${todo?._id}`, {
                                    status: "running",
                                  })
                                  .then((res) => {
                                    console.log(res.data);
                                    refetch();
                                    return (
                                      <span
                                        className={`${
                                          todo?.status === "running"
                                            ? "text-success font-bold"
                                            : ""
                                        }`}>
                                        {"[Will Happen Today]"}
                                      </span>
                                    );
                                  });
                              } else {
                                /* change status running to completed */
                                axios
                                  .patch(`/update-tasks/${todo?._id}`, {
                                    status: "completed",
                                  })
                                  .then((res) => {
                                    console.log(res.data);
                                    return refetch();
                                  });
                              }
                            },
                            nextDay: () => {
                              nextDayNotification;
                            },
                            nextWeek: "dddd",
                            lastDay: "[Yesterday]",
                            lastWeek: "[Last] dddd",
                            sameElse: "DD/MM/YYYY",
                          })}
                          {/* {moment().to(todo?.date)} */}
                        </td>
                        <th>
                          <button
                            onClick={() => handleDeleteTask(todo?._id)}
                            className="btn btn-ghost btn-xs text-xl text-error">
                            <FaTrashCan />
                          </button>
                          <Link
                            to={`/manage-task/${todo?._id}`}
                            className="btn btn-ghost btn-xs text-xl text-info">
                            <FaEdit />
                          </Link>
                        </th>
                      </tr>
                    ))}
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
