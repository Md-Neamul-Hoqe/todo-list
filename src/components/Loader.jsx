import PropTypes from "prop-types";
import { CirclesWithBar } from "react-loader-spinner";

const Loader = ({ ratio = 1 }) => {
  /* tailwindcss can't calculate 2 step calculation so create class name then only put the class name variable */

  return (
    <div
      className={`flex justify-center items-center ${
        ratio === 1
          ? "min-h-screen"
          : ratio === 2
          ? "min-h-[calc(100vh/2)]"
          : "min-h-[calc(100vh/3)]"
      }`}>
      <CirclesWithBar
        height="100"
        width="100"
        color="#4fa94d"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        outerCircleColor=""
        innerCircleColor=""
        barColor=""
        ariaLabel="circles-with-bar-loading"
      />
      ;
    </div>
  );
};

Loader.propTypes = {
  ratio: PropTypes.number,
};

export default Loader;
