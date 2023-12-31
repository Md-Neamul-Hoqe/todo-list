import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosHook from "../Hooks/useAxiosHook";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import auth from "../config/firebase.config";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

export const AuthContext = createContext({});
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  /**
   * ====================
   * Credentials Functions
   * ====================
   */

  const createUser = (email, password) => {
    setLoading(true);

    return createUserWithEmailAndPassword(auth, email, password);
  };

  const userSingIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const userSignOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const googleSignInUser = () => {
    return signInWithPopup(auth, googleProvider);
  };

  /* Auth state change */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser?.email };
        try {
          axios.post("/auth/jwt", userInfo).then(() => {
            setLoading(false);
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: error?.message,
            showConfirmButton: true,
          });
        }
      } else {
        // remove token
        axios.post("/user/logout", currentUser).then(() => {
          setLoading(false);
        });
      }

      // console.log("Current User", currentUser);
    });

    return () => {
      return () => unsubscribe();
    };
  }, [axios]);

  const updateUserProfileImage = (name, photoUrl) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
  };

  /**
   * ========================
   * To-Do Functionality
   * ========================
   */
  const handleDeleteTask = (id, refetch) => {
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

  const handleNotification = (taskStatus) => {
    try {
      user?.email &&
        axios.post(`/set-notifications?email=${user?.email}`, taskStatus);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: error?.message,
        showConfirmButton: true,
      });
    }
  };
  const {
    data: notification = [],
    isPending: isPendingNotification,
    isLoading: isLoadingNotification,
    refetch: refetchNotification,
  } = useQuery({
    enabled: !loading && !!user,
    refetchOnWindowFocus: false,
    queryKey: ["notifications", user?.email],
    queryFn: async () => {
      if (user?.email) {
        const res = await axios.get(`/notifications?email=${user?.email}`);
        return res?.data;
      }
    },
  });
  /**
   * =========================
   *  Context Variables
   * =========================
   * */
  const authInfo = {
    headings,
    handleDeleteTask,
    searchResult,
    setSearchResult,
    handleNotification,
    notification,
    refetchNotification,
    isPendingNotification,
    isLoadingNotification,

    user,
    setUser,
    loading,
    setLoading,
    createUser,
    userSingIn,
    updateUserProfileImage,
    userSignOut,
    googleSignInUser,
    error,
    setError,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
