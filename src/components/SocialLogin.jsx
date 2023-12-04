import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../Hooks/useAuth";
import useAxiosHook from "../Hooks/useAxiosHook";

const SocialLogin = () => {
  const axios = useAxiosHook();
  const navigate = useNavigate();
  const { googleSignInUser, setError } = useAuth();

  const handleGoogleSignIn = () => {
    googleSignInUser()
      .then((res) => {
        // console.log(res);
        const userInfo = {
          name: res?.user?.displayName,
          email: res?.user?.email,
        };

        axios
          .post("/create-user", userInfo)
          .then((result) => {
            console.log(result?.data);

            result?.data?.message
              ? setTimeout(() => {
                  Swal.fire({
                    icon: "success",
                    title: result?.data?.message,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                }, 1000)
              : !res?.insertedId &&
                Swal.fire({
                  icon: "success",
                  title: "User profile created successfully.",
                  showConfirmButton: false,
                  timer: 1500,
                });

            return navigate("/");
          })
          .catch((error) =>
            Swal.fire({
              icon: "error",
              title: error?.message,
              showConfirmButton: true,
            })
          );
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <div>Or sign in with [only google is now allowed]</div>
      <div className="flex justify-center gap-5">
        <Link className="rounded-full p-3 border border-black text-black hover:opacity-70">
          <FaFacebookF />
        </Link>
        <Link
          onClick={handleGoogleSignIn}
          className="rounded-full p-3 border border-black text-black hover:opacity-70">
          <FaGoogle />
        </Link>
        <Link className="rounded-full p-3 border border-black text-black hover:opacity-70">
          <FaGithub />
        </Link>
      </div>
      <div className="divider "></div>
      <Link to="/" className="btn btn-sm bg-green-700 text-white">
        Go Home
      </Link>
    </>
  );
};

export default SocialLogin;
