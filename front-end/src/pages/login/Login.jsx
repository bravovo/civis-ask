import { useState } from "react";
import FormInput from "../../components/ui/FormInput/FormInput.jsx";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../components/ui/Popup/Popup.jsx";
import { setLoading } from "../../state/loaderSlice.js";
import { setCreds } from "../../state/profileSlice.js";
import api from "../../api/api";

function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isRegistered = location.state?.registered;
  const isLoggedOut = location.state?.loggedOut;
  const accountDeleted = location.state?.deletedAccount;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { authChecked, token, message } = useSelector((state) => state.profile);

  if (authChecked && token) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      dispatch(setLoading(true));
      if (email && password) {
        const response = await api.post(`/auth/login`, {
          email,
          password,
        });

        if (response.status === 200) {
          dispatch(
            setCreds({
              user: response.data.user,
              token: response.data.accessToken,
            })
          );
          dispatch(setLoading(false));
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response);
        setError(error.response.data.message);
      } else {
        console.error(error);
      }
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6">
      {isRegistered && <Popup text="Користувача створено успішно!" />}
      {isLoggedOut && <Popup text="Ви успішно вийшли з акаунта" />}
      {accountDeleted && <Popup text="Ваш акаунт успішно видалено" />}
      {error && <Popup text={error} color="red" />}
      <h2 className="font-bold text-2xl md:text-4xl">Авторизація</h2>
      <form
        onSubmit={handleLoginSubmit}
        className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
      >
        <FormInput
          title="Електронна пошта"
          name="userEmail"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <FormInput
          title="Пароль"
          name="userPassword"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button type="submit">Увійти</button>
        {!isRegistered && <Link to="/register">Ще не маєте акаунта?</Link>}
      </form>
    </div>
  );
}

export default Login;
