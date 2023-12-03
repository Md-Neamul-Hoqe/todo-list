import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosHook from "../Hooks/useAxiosHook";

const Navbar = () => {
  const NavLinks = (
    <>
      <li>
        <NavLink to={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink to={"/history"}>History</NavLink>
      </li>
    </>
  );

  const axiosSecure = useAxiosHook();

  const { handleSubmit, register } = useForm();

  const onSubmit = (data) => {
    const { search } = data;

    console.log(search);

    try {
      axiosSecure
        .post(`/search?search=${search}`)
        .then((res) => {
          console.log(res?.data);
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
        <form className="flex relative " onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control">
            <label className="label">
              <span className="label-text sr-only">Search by title</span>
            </label>
            <input
              {...register("search")}
              type="text"
              placeholder="Search by title..."
              className="input input-bordered"
            />
          </div>

          <button className="btn btn-ghost btn-circle absolute right-0 top-4">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
