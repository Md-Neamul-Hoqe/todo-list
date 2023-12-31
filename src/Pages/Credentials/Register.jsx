import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import SocialLogin from "../../components/SocialLogin";
import useAxiosHook from "../../Hooks/useAxiosHook";
import useAuth from "../../Hooks/useAuth";

const Register = () => {
  const axiosPublic = useAxiosHook();
  const { setError, createUser, updateUserProfileImage } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmitForm = (data) => {
    // console.log(data);
    const { email, password, name, photoURL } = data;

    // console.log({ email, password, name, photoURL });

    createUser(email, password)
      .then(() => {
        // const loggedUser = res?.user;

        // console.log(res);
        updateUserProfileImage(email, photoURL).then(() => {
          // console.log(res);

          const userInfo = {
            name: name,
            email: email,
          };

          axiosPublic.post("/create-user", userInfo).then((res) => {
            if (res?.data?.insertedId) {
              // console.log("User photo updated.");

              Swal.fire({
                icon: "success",
                title: `<h2>
                May Allah bless the truthful.
              </h2>`,
                html: `
                    <p>Welcome My To-Do Application.</p>
                    `,
                showConfirmButton: false,
                timer: 1500,
              });

              reset();

              navigate("/");
            } else {
              Swal.fire({
                icon: "error",
                title: `Database error: ${res?.data}.`,
                showConfirmButton: true,
              });
            }
          });
        });

        // console.log(res, loggedUser);
      })
      .catch((error) => {
        setError(error?.message);

        Swal.fire({
          icon: "error",
          title: error?.message,
          showConfirmButton: true,
        });
      });
  };

  return (
    <aside className="py-5">
      <h1 className="text-5xl font-bold text-center">Register now!</h1>
      <form onSubmit={handleSubmit(onSubmitForm)} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            {...register("name")}
            type="name"
            placeholder="name"
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="email"
            className="input input-bordered"
          />
          {errors.email && <p className="text-red-600">email is required.</p>}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
            })}
            type="password"
            placeholder="password"
            className="input input-bordered"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-600">password is required.</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-600">
              password must be at least 6 characters long.
            </p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-600">
              password must have a number, a lowercase character, a uppercase
              character and a special character.
            </p>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Photo URL</span>
          </label>
          <input
            {...register("photoURL")}
            type="url"
            placeholder="Photo URL"
            className="input input-bordered"
          />
        </div>
        <div className="form-control mt-6">
          <button type="submit" className="btn bg-green-700 text-white">
            Sign Up
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center gap-5">
        <div className="text-green-700">
          Already registered?
          <Link to="/credentials/sign-in"> Go to log in</Link>
        </div>
        <SocialLogin />
      </div>

      <Helmet>
        <title>To-Do List | Sign Up</title>
      </Helmet>
    </aside>
  );
};

export default Register;
