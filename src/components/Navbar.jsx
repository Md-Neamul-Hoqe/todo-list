import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosHook from "../Hooks/useAxiosHook";
import useAuth from "../Hooks/useAuth";
import Loader from "./Loader";
import { useEffect } from "react";

const Navbar = () => {
  const {
    user,
    loading,
    userSignOut,
    setSearchResult,
    notification,
    refetchNotification,
  } = useAuth();

  const axiosSecure = useAxiosHook();
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();

  const NavLinks = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/history"}>History</NavLink>
      </li>
      {user?.email ? (
        <li>
          <button onClick={userSignOut} className="outline-white">
            Sign Out
          </button>
        </li>
      ) : (
        <li>
          <NavLink to={"/credentials/sign-in"}>Sign In</NavLink>
        </li>
      )}
    </>
  );

  useEffect(() => {
    if (loading) <Loader />;
    else if (!user?.email) navigate("/credentials/sign-in");
  }, [loading, navigate, user?.email]);

  let showNotificationsContent = "";
  const Length = notification?.length;
  for (let index = 0; index < Length; index++) {
    showNotificationsContent +=
      "<li> <strong className='text-green-700 italic'>" +
      notification[index]?.status.charAt(0).toUpperCase() +
      notification[index]?.status.slice(1) +
      "</strong>: " +
      notification[index]?.title +
      "</li>";
  }
  if (!Length) showNotificationsContent = "No notification found";

  const ShowNotifications = () => {
    Swal.fire({
      title: Length ? "Notifications" : "Message Inbox Cleared",
      icon: Length ? "info" : "success",
      html: `<ul>${showNotificationsContent}</ul>`,
      showCloseButton: true,
      closeButtonHtml: `<span id="notificationShow">&times;</span>`,
      showConfirmButton: true,
    });

    const notificationShow = document.getElementById("notificationShow");

    notificationShow?.addEventListener("click", () => {
      try {
        user?.email &&
          axiosSecure
            .delete(`/remove-notifications?email=${user?.email}`)
            .then((res) => {
              res?.data?.deletedCount && refetchNotification();
            });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const onSubmit = (data) => {
    const { search } = data;

    if (search) {
      try {
        axiosSecure
          .get(`/search/?search=${search}&email=${user?.email}`)
          .then((res) => {
            // console.log(res?.data);
            setSearchResult(res?.data);
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              icon: "error",
              title: error?.message,
              showConfirmButton: true,
            });
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
      setSearchResult("");
    }
  };

  return (
    <nav className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {NavLinks}
          </ul>
        </div>
        <ul className="menu menu-horizontal px-1 hidden lg:flex">{NavLinks}</ul>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-2xl font-serif">To-Do</a>
      </div>
      <div className="navbar-end">
        <form className="flex relative" onKeyUp={handleSubmit(onSubmit)}>
          <span className="rounded-full absolute left-2 top-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 md:h-7 md:w-7 max-md:my-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          <div className="form-control">
            <input
              {...register("search")}
              type="text"
              placeholder="Type to search..."
              className="input input-bordered md:ps-10 max-md:w-12 cursor-text"
            />
          </div>
        </form>

        {/* Notification */}
        <button
          onClick={ShowNotifications}
          className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item">
              {notification?.length}
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
