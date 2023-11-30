import axios from "axios";
// import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

/* TODO: use interceptors */

const useAxiosHook = () => {

  const navigate = useNavigate();
  // console.log(location);
  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      // console.log("response: ", err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        console.error(err?.response);


        navigate("/credentials/login");
      } else if (err?.response?.status === 400) {
        console.error(err?.response);
        Swal.fire({
          icon: "error",
          title: "Please enable your third-party cookies.",
          showConfirmButton: true,
        });
      }
      return Promise.reject(err);
    }
  );

  return axiosInstance;
};

export default useAxiosHook;
