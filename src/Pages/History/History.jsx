import Loader from "../../components/Loader";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import "moment-timezone";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import useGetTasks from "../../Hooks/useGetTasks";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useAuth from "../../Hooks/useAuth";

const History = () => {
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

  // const DateOfToDay = moment().format("YYYY-MM-DDTHH:mm");
  // console.log(DateOfToDay);
  /* TODO: use hook - dynamic url both all / a todo */

  const [todoList, isPending, isLoading, refetch] = useGetTasks("completed");

  // console.log(moment().hours());
  // console.log(moment().date());

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquered To-Do List
      </h2>

      <div>
        {!isPending && !isLoading ? (
          Array.isArray(todoList) ? (
            todoList?.length > 0 ? (
              <div className="overflow-x-auto md:mx-10">
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
                        <td>
                          {todo?.status} <br />
                          {moment(todo?.date).calendar(null, {
                            sameDay: function (now) {
                              if (this.isAfter(now)) {
                                return "[Will Happen Today]";
                              } else {
                                axios
                                  .patch(`/update-tasks/${todo?._id}`, {
                                    status: "completed",
                                  })
                                  .then((res) => {
                                    refetch();
                                    console.log(res.data);

                                    return "[Happened Today]";
                                  });
                              }
                            },
                            nextDay: "[Tomorrow]",
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

export default History;
