import loginImg from "/Illustration.svg";
import formImg from "/authentication.jpg";
import { Outlet } from "react-router-dom";

const Credentials = () => {
  return (
    <div
      className="hero min-h-screen"
    >
      <div
        className={`hero-content justify-between xl:w-[1280px] flex-col lg:flex-row drop-shadow-2xl shadow-black p-10`}
        style={{ backgroundImage: `url(${formImg})` }}>
        <div className="text-center lg:text-left flex-1">
          <img src={loginImg} alt="" />
        </div>
        <div className="card flex-1 bg-base-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Credentials;
