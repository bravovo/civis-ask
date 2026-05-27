import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../state/loaderSlice.js";
import api from "../../api/api.js";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [gender, setGender] = useState("");

  const [error, setError] = useState("");
  const [stage, setStage] = useState(1);

  const { authChecked, token } = useSelector((state) => state.profile);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (authChecked && token) {
    return <Navigate to="/" replace />;
  }

  const handleNextStage = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Паролі у полях не співпадають");
      return;
    }
    setError("");
    setStage(2);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !age ||
      !gender
    ) {
      setError("Потрібно ввести всі дані реєстрації");
      return;
    }

    try {
      setError("");
      dispatch(setLoading(true));

      const response = await api.post(`/auth/register`, {
        email,
        password,
        firstName,
        lastName,
        age: Number(age),
        gender,
      });

      if (response.status === 201) {
        dispatch(setLoading(false));
        navigate("/login", {
          state: { registered: true },
        });
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Помилка реєстрації");
      } else {
        setError("Помилка реєстрації");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-6 px-3">
      <Toaster position="top-center" />

      {stage === 1 ? (
        <form onSubmit={handleNextStage} className="w-full max-w-sm">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Реєстрація</CardTitle>
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline"
                >
                  Увійти
                </Link>
              </div>
              <CardDescription>Введіть свої облікові дані</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Електронна пошта</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Ім'я</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Ім'я"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Прізвище</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Прізвище"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Підтвердження паролю</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Далі
              </Button>
            </CardFooter>
          </Card>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="w-full max-w-sm">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Реєстрація</CardTitle>
                <Link
                  to="/login"
                  className="text-sm text-primary hover:underline font-light"
                >
                  Увійти
                </Link>
              </div>
              <CardDescription>Введіть свої демографічні дані</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">Вік</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="16"
                    min={16}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Стать</Label>
                  <Select
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Оберіть стать" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectGroup>
                        {genders.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  setStage(1);
                }}
              >
                Назад
              </Button>
              <Button type="submit" className="flex-1">
                Зареєструватись
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}

export default Register;
