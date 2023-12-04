import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosHook from "../Hooks/useAxiosHook";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext({});
const AuthProvider = ({ children }) => {
  // const [notification, setNotification] = useState([]);
  const [runningTask, setRunningTask] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const axios = useAxiosHook();

  /* Table header and footer's headings */
  const headings = (
    <tr>
      <th>#</th>
      <th>Title</th>
      <th>Description</th>
      <th>Due Time</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  );

  /* Get the titles of all task of which status is running also get notifications */

  const {
    data: tasks,
    isPending: isPendingTitles,
    isLoading: isLoadingTitles,
    refetch: refetchTitles,
  } = useQuery({
    // enabled:
    queryKey: ["running-task-titles"],
    queryFn: async () => {
      const res = await axios.get("/running-tasks");

      console.log(res?.data);

      return res?.data;
    },
  });
  // console.log(tasks);

  useEffect(() => {
    if (tasks?.count) {
      setRunningTask(
        `The <b>'${tasks?.titles}'</b> ${
          tasks?.count > 1 ? " are" : " is"
        } deadline approached.`
      );
    } else {
      setRunningTask("");
    }
  }, [tasks]);

  const {
    data: notification,
    isPending: isPendingNotification,
    isLoading: isLoadingNotification,
    refetch: refetchNotification,
  } = useQuery({
    // enabled:
    queryKey: ["running-task-titles"],
    queryFn: async () => {
      const res = await axios.get("/notifications");
      return res?.data;
    },
  });

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

  /* Fist loading throw undefined */
  if (!notification) refetchNotification();

  if (!tasks) {
    refetchTitles();
  }
  const handleNotification = (taskStatus) => {
    console.log(taskStatus);
    try {
      axios
        .post("/set-notifications", taskStatus)
        .then((res) => console.log(res?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const authInfo = {
    headings,
    runningTask,
    setRunningTask,
    handleDeleteTask,
    searchResult,
    setSearchResult,
    refetchTitles,
    handleNotification,
    notification,
    refetchNotification,
    isLoadingTitles,
    isPendingTitles,
    isPendingNotification,
    isLoadingNotification,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
