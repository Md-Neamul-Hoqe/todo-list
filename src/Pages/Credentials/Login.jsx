import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "../../components/SocialLogin";

const Login = () => {
  const { userSingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location?.state?.from?.pathname || "/";

  // console.log(from);

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log(e.target);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      userSingIn(email, password).then(() => {

        Swal.fire({
          icon: "success",
          title: "Signed in successfully",
          showConfirmButton: false,
          timer: 1000,
        });

        return navigate(from, { replace: true });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error?.message,
        showConfirmButton: true,
      });
    }

    // console.log(email, password);
  };

  return (
    <aside className="py-5">
      <h1 className="text-5xl font-bold text-center">Login now!</h1>
      <form onSubmit={handleLogin} className="card-body">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="email"
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="input input-bordered"
            required
          />
          {/* <label className="label">
            <a href="#" className="label-text-alt link link-hover">
              Forgot password?
            </a>
          </label> */}
        </div>
        <div className="form-control mt-6">
          <button type="submit" className="btn bg-green-700 text-white">
            Login
          </button>
        </div>
      </form>
      <div className="flex flex-col items-center gap-5">
        <div className="text-green-700">
          New here? <Link to="/credentials/register">Create a New Account</Link>
        </div>
        <SocialLogin />
      </div>
      <Helmet>
        <title>To-Do List | Sign In</title>
      </Helmet>
    </aside>
  );
};

export default Login;
