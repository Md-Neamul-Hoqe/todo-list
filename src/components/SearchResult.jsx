import moment from "moment";
import useAuth from "../Hooks/useAuth";
import { FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const SearchResult = () => {
  const { handleDeleteTask, searchResult, headings, refetch } = useAuth();
  return searchResult?.length > 0 ? (
    <section className={`min-h-[calc(100vh/2)] m-10`}>
      <h2 className="text-xl text-center font-semibold capitalize italic">
        From search result
      </h2>
      <div className="overflow-x-auto md:mx-10 text-right p-10 border border-green-700 rounded-xl">
        <table className="table table-zebra-zebra">
          {/* head */}
          <thead>{headings}</thead>
          <tbody>
            {searchResult?.map(
              ({ _id, title, description, status, date }, index) => (
                <tr key={_id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="font-bold">{title}</div>
                  </td>
                  <td>{description}</td>
                  <td>{moment(date).format("dddd, MMMM D, YY, h:mm a")}</td>
                  <td
                    className={
                      status === "running" ? "text-green-700 font-semibold" : ""
                    }>
                    {status}
                    <br />
                    {moment(date).calendar(null, {
                      sameDay: function (now) {
                        if (this.isAfter(now)) {
                          return "[Will Happen Today]";
                        } else {
                          return "[Will Happen Today]";
                        }
                      },
                      nextDay: "[Tomorrow]",
                      nextWeek: "dddd",
                      lastDay: "[Yesterday]",
                      lastWeek: "[Last] dddd",
                      sameElse: "DD/MM/YYYY",
                    })}
                  </td>
                  <th>
                    <button
                      onClick={() => {
                        // console.log(title);
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
        </table>
      </div>
    </section>
  ) : null;
};

export default SearchResult;
