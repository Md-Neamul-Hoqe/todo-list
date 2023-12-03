import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosHook from "../Hooks/useAxiosHook";
import Swal from "sweetalert2";

export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [notification, setNotification] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const axios = useAxiosHook();
  const headings = (
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Description</th>
      <th>Status</th>
      <th>Due Time</th>
      <th>Actions</th>
    </tr>
  );

  /* Get the titles of all task of which status is running */
  useEffect(() => {
    axios.get("/running-tasks").then((res) => {
      const titles = res?.data?.titles;
      const Length = res?.data?.count;

      console.log(titles);

      if (Length) {
        setNotification(
          `The <b>'${titles}'</b> ${
            Length > 1 ? " are" : " is"
          } deadline approached.`
        );
      } else {
        setNotification("");
      }
    });
  }, [axios]);

  const handleDeleteTask = (id, refetch) => {
    // console.log(id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result?.isConfirmed) {
        axios
          .delete(`/delete-tasks/${id}`)
          .then((res) => {
            if (res?.data?.deletedCount) {
              refetch();

              Swal.fire({
                icon: "success",
                title: "The task is deleted",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: error?.message,
              showConfirmButton: true,
            });
          });
      }
    });
  };

  const authInfo = {
    handleDeleteTask,
    notification,
    setNotification,
    headings,searchResult, setSearchResult
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
