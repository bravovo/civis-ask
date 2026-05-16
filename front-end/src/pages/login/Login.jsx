import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../state/loaderSlice.js";
import { setCreds } from "../../state/profileSlice.js";
import api from "../../api/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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

  useEffect(() => {
    if (isRegistered) {
      toast.success("Користувача створено успішно!");
    } else if (isLoggedOut) {
      toast.success("Ви успішно вийшли з акаунта");
    } else if (accountDeleted) {
      toast.success("Ваш акаунт успішно видалено");
    } else if (message) {
      toast.info(message);
    }
  }, [isRegistered, isLoggedOut, accountDeleted, message]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

        if (response.data.success) {
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
    <div className="w-full h-full flex flex-col justify-center items-center gap-6 px-3">
      <Toaster position="top-center" />
      <form onSubmit={handleLoginSubmit} className="w-full max-w-sm">
        <Card
          size="default"
          className="w-full max-w-sm"
          onSubmit={handleLoginSubmit}
        >
          <CardHeader>
            <CardTitle>Авторизація</CardTitle>
            <CardDescription>
              Введіть свої облікові дані для входу
            </CardDescription>
            <CardAction>
              <Link
                to="/register"
                className="text-sm text-primary hover:underline"
              >
                Зареєструватися
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Електронна пошта</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full hover:bg-primary/90">
              Увійти
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Login;
