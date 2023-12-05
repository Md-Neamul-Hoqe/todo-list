import Loader from "../../components/Loader";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import "moment-timezone";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import useGetTasks from "../../Hooks/useGetTasks";
import useAuth from "../../Hooks/useAuth";

const History = () => {
  const { handleDeleteTask, headings } = useAuth();

  const [todoList, isPendingToDoList, isLoadingToDoList, refetch] =
    useGetTasks("completed");

  return (
    <div>
      <h2
        className="text-5xl font-mono font-semibold text-center my-10"
        style={{ fontVariant: "small-caps" }}>
        Conquered To-Do List
      </h2>

      <div>
        {!isPendingToDoList && !isLoadingToDoList ? (
          Array.isArray(todoList) ? (
            todoList?.length > 0 ? (
              <div className="overflow-x-auto md:m-10">
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
                          <td>
                            {status} <br />
                            {moment(date).calendar(null, {
                              sameDay: "[Happened Today]",
                              lastDay: "[Yesterday]",
                              lastWeek: "[Last] dddd",
                              sameElse: "DD/MM/YYYY",
                            })}
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
