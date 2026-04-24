import { useState } from "react";
import FormInput from "../../components/ui/FormInput/FormInput.jsx";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../state/loaderSlice.js";
import Popup from "../../components/ui/Popup/Popup.jsx";
import api from "../../api/api.js";

const genders = [
  { value: "male", label: "Чоловік" },
  { value: "female", label: "Жінка" },
];

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState({
    value: "placeholder",
    label: "Оберіть стать",
  });

  const [error, setError] = useState("");
  const [stage, setStage] = useState(1);

  const { authChecked, token } = useSelector((state) => state.profile);

  if (authChecked && token) {
    return <Navigate to="/" replace />;
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      if (
        !email ||
        !password ||
        !confirmPassword ||
        !firstName ||
        !lastName ||
        !age ||
        !selectedGender ||
        selectedGender.value === "placeholder"
      ) {
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
        age,
        gender: selectedGender.value,
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
      {stage === 1 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStage(2);
          }}
          className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
        >
          <FormInput
            title="Електронна пошта"
            name="userEmail"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
          />
          <FormInput
            title="Ім'я"
            name="userFirstName"
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            value={firstName}
          />
          <FormInput
            title="Прізвище"
            name="userLastName"
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            value={lastName}
          />
          <FormInput
            title="Пароль"
            name="userPassword"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
          <FormInput
            title="Підтвердження паролю"
            name="userConfirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            value={confirmPassword}
          />
          <button type="submit">Далі</button>
          <Link to="/login">Вже маєте акаунт?</Link>
        </form>
      ) : (
        <form
          onSubmit={handleRegisterSubmit}
          className="w-2xs md:w-[450px] flex flex-col justify-center items-center gap-3 py-5 px-3 border-[1.5px] border-b-gray-400 rounded-[8px]"
        >
          <FormInput
            title="Вік"
            name="userAge"
            onChange={(e) => setAge(e.target.value)}
            type="number"
            value={age}
          />
          <div className="w-full flex flex-col gap-1 justify-start m-0">
            Стать
            <button
              type="button"
              onClick={() => setGenderDropdownOpen((prev) => !prev)}
            >
              {selectedGender.label}
            </button>
            {genderDropdownOpen && (
              <div className="flex flex-col gap-1">
                {genders.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedGender(option);
                      setGenderDropdownOpen(false);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStage(1)}>
              Назад
            </button>
            <button type="submit">Зареєструватись</button>
          </div>
          <Link to="/login">Вже маєте акаунт?</Link>
        </form>
      )}
    </div>
  );
}

export default Register;
