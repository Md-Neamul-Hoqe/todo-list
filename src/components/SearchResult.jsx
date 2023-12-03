import moment from "moment";
import useAuth from "../Hooks/useAuth";

const SearchResult = () => {
  const { searchResult, headings } = useAuth();
  return searchResult?.length > 0 ? (
    <div
      className={`min-h-[calc(100vh/2)] p-10 border border-green-700 rounded-xl m-10`}>
      <div className="overflow-x-auto md:mx-10 text-right">
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
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : null;
};

export default SearchResult;
