import { useState } from "react";
import FormInput from "../../components/ui/FormInput/FormInput.jsx";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../state/loaderSlice.js";
import Popup from "../../components/ui/Popup/Popup.jsx";
import api from "../../api/api.js";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const { authChecked, token } = useSelector((state) => state.profile);

  if (authChecked && token) {
    return <Navigate to="/" replace />;
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        setError("Потрібно ввести всі дані реєстрації");
        return;
      }

      if (password !== confirmPassword) {
        setError("Паролі у полях не співпадають");
        return;
      }
      dispatch(setLoading(true));

      const response = await api.post(`/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.status === 201) {
        dispatch(setLoading(false));
        navigate("/login", {
          state: { registered: true },
        });
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
      {error && <Popup text={error} color="red" duration={5000} />}
      <h2 className="font-bold text-2xl md:text-4xl">Створення акаунта</h2>
      <form
        onSubmit={handleRegisterSubmit}
        className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
      >
        <FormInput
          title="Електронна пошта"
          name="userEmail"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <FormInput
          title="Ім'я"
          name="userFirstName"
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
        />
        <FormInput
          title="Прізвище"
          name="userLastName"
          onChange={(e) => setLastName(e.target.value)}
          type="text"
        />
        <FormInput
          title="Пароль"
          name="userPassword"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <FormInput
          title="Підтвердження паролю"
          name="userConfirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
        />
        <button type="submit">Зареєструватись</button>
        <Link to="/login">Вже маєте акаунт?</Link>
      </form>
    </div>
  );
}

export default Register;
