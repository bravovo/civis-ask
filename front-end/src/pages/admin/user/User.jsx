import AdminSurveyCard from "@/components/AdminSurveyCard/AdminSurveyCard";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";

import api from "@/api/api";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { formatUserFullName } from "../../../utils/utils";
import Loader from "@/components/ui/Loader/Loader";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  TypographyH2,
  TypographyH3,
  TypographyLead,
} from "../../../utils/styles";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AdminDeleteUserAccountDialog from "@/components/AdminDeleteUserAccountDialog/AdminDeleteUserAccountDialog";
import { useDispatch, useSelector } from "react-redux";
import { getPublishedSurveys } from "@/state/surveysSlice";

function User() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const currentUserId = useSelector((state) => state.profile._id);
  const surveys = useSelector((state) => state.surveyList);
  const [userSurveys, setUserSurveys] = useState([]);
  const [loading, setLoading] = useState(false);

  function getUserSurveys() {
    if (!user || !surveys) return [];

    return surveys.items.filter((s) => s.author._id === user._id);
  }

  useEffect(() => {
    if (surveys.status === "none") {
      dispatch(getPublishedSurveys());
    }
  }, []);

  useEffect(() => {
    setUserSurveys(getUserSurveys());
  }, [surveys, user]);

  useEffect(() => {
    async function getUser() {
      if (loading) {
        return;
      }
      setLoading(true);

      try {
        const response = await api.get(`/admin/users/${userId}`);

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
          toast.error(
            "Невдалось з'єднатись з сервером. Будь ласка, спробуйте пізніше"
          );
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(
            error.message || "Не вдалось оновити профіль. Спробуйте ще раз"
          );
        }
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      getUser();
    }
  }, [userId]);

  if (loading || surveys.status === "loading") {
    return <Loader />;
  }

  if (!user) {
    return (
      <EmptyComponent
        title="Користувача не знайдено"
        description="Перевірте правильність посилання або поверніться до списку користувачів"
        buttonText="Повернутись до списку користувачів"
        buttonLink="/admin/users"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
        {TypographyH2("Профіль користувача")}
      </div>
      <Card className="w-full">
        <CardHeader className="w-full flex flex-col md:flex-row justify-between items-center">
          <CardTitle className="w-full flex flex-col md:flex-row gap-6">
            <div className="block md:hidden">
              {user.role === "admin" ? TypographyH3("Адміністратор") : null}
              {TypographyLead(
                formatUserFullName({
                  firstName: user.firstName,
                  lastName: user.lastName,
                })
              )}
              {TypographyLead(user.email)}
              {user.age
                ? TypographyLead("Вік: " + user.age)
                : TypographyLead("Вік: дані відсутні", "text-destructive")}
              {user.gender
                ? TypographyLead(
                    "Стать: " + (user.gender === "male" ? "Чоловік" : "Жінка")
                  )
                : TypographyLead("Стать: дані відсутні", "text-destructive")}
            </div>
            <Item
              variant="muted"
              className="hidden md:block hover:bg-background hover:border-border transition-colors duration-200"
            >
              <ItemContent>
                <ItemTitle>{TypographyH3(`Загальна інформація`)}</ItemTitle>
                {TypographyLead(
                  formatUserFullName({
                    firstName: user.firstName,
                    lastName: user.lastName,
                  })
                )}
                {TypographyLead(user.email)}
                {user.role === "admin" ? TypographyH3("Адміністратор") : null}
              </ItemContent>
            </Item>
            <Item
              variant="contrast"
              className="hidden md:block mr-6 hover:border-transparent hover:bg-muted/50 transition-colors duration-200"
            >
              <ItemContent>
                <ItemTitle>{TypographyH3(`Демографічна інформація`)}</ItemTitle>
                {user.age
                  ? TypographyLead("Вік: " + user.age)
                  : TypographyLead("Вік: дані відсутні", "text-destructive")}
                {user.gender
                  ? TypographyLead(
                      "Стать: " + (user.gender === "male" ? "Чоловік" : "Жінка")
                    )
                  : TypographyLead("Стать: дані відсутні", "text-destructive")}
              </ItemContent>
            </Item>
          </CardTitle>
          <CardAction className="h-full">
            <AdminDeleteUserAccountDialog userId={user._id} />
          </CardAction>
        </CardHeader>
        <CardContent className="w-full pb-4">
          {userSurveys.length > 0 ? (
            <div className="flex flex-col gap-2 pt-3">
              {userSurveys.map((s) => (
                <AdminSurveyCard
                  key={s._id}
                  data={s}
                  author={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isAuthor: currentUserId === user._id,
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyComponent
              title="У користувача ще немає створених опитувань"
              description="Коли користувач створить опитування, воно з'явиться у цьому списку"
              buttonText="Повернутись до списку користувачів"
              buttonLink="/admin/users"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default User;
