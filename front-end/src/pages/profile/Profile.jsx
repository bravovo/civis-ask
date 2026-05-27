import { useDispatch, useSelector } from "react-redux";
import { formatUserFullName } from "../../utils/utils";
import { useEffect } from "react";
import {
  getSurveysPassedByUser,
  getUserSurveys,
} from "../../state/profileSlice";
import Loader from "../../components/ui/Loader/Loader";
import SurveyCard from "../../components/SurveyCard/SurveyCard";
import { useNavigate } from "react-router-dom";
import EditProfileDialog from "../../components/ui/dialogs/EditProfileDialog";
import ChangePasswordDialog from "../../components/ui/dialogs/ChangePasswordDialog";
import DeleteAccountDialog from "../../components/ui/dialogs/DeleteAccountDialog";
import Tabs from "../../components/Tabs/Tabs";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2, TypographyH3, TypographyLead } from "../../utils/styles";
import LogoutDialog from "@/components/ui/dialogs/LogoutDialog";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSurveys, passedSurveys, ...profile } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (profile.passedSurveysStatus === "none") {
      dispatch(getSurveysPassedByUser());
    }

    if (profile.surveysStatus === "none") {
      dispatch(getUserSurveys());
    }
  }, [profile.passedSurveysStatus, profile.surveysStatus]);

  useEffect(() => {
    if (
      (profile.authChecked && !Boolean(profile.age)) ||
      !Boolean(profile.gender)
    ) {
      toast.error("Будь ласка, заповніть дані про вік та стать");
    }
  }, []);

  if (
    profile.surveysStatus === "loading" ||
    profile.passedSurveysStatus === "loading"
  ) {
    return <Loader />;
  }

  if (
    profile.surveysStatus === "error" ||
    profile.passedSurveysStatus === "error"
  ) {
    return (
      <EmptyComponent
        title="Помилка при завантаженні даних"
        description="Виникла помилка при завантаженні даних. Спробуйте ще раз."
        buttonText="На головну"
        buttonLink="/"
      />
    );
  }

  const mySurveys =
    userSurveys.length > 0 ? (
      <div className="flex flex-col gap-2 pt-3">
        {userSurveys.map((s) => (
          <SurveyCard key={s._id} data={s} fromProfile={true} />
        ))}
      </div>
    ) : (
      <EmptyComponent
        title="У вас ще немає створених опитувань"
        description="Створіть нове опитування, щоб побачити його у списку"
        buttonText="Створити опитування"
        buttonLink="/new-survey"
      />
    );

  const myPassedSurveys =
    passedSurveys.length > 0 ? (
      <div className="flex flex-col gap-2 pt-3">
        {passedSurveys.map((s) => (
          <SurveyCard
            key={s._id}
            data={s}
            isSurveyTake={true}
            fromProfile={true}
          />
        ))}
      </div>
    ) : (
      <EmptyComponent
        title="Ви ще не пройшли жодного опитування"
        description="Пройдіть опитування, щоб побачити його у списку пройдених"
        buttonText="Перейти на головну"
        buttonLink="/"
      />
    );

  const tabs = [
    {
      id: "my_surveys",
      label: "Мої опитування",
      children: mySurveys,
    },
    {
      id: "passed_surveys",
      label: "Пройдені опитування",
      children: myPassedSurveys,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 px-3">
      <div className="w-full flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="w-20">
          Назад
        </Button>
        {TypographyH2("Профіль")}
      </div>
      <Card className="w-full">
        <CardHeader className="w-full flex flex-col md:flex-row justify-between items-center">
          <CardTitle className="w-full flex flex-col md:flex-row gap-6">
            <div className="block md:hidden">
              {profile.role === "admin" ? TypographyH3("Адміністратор") : null}
              {TypographyLead(
                formatUserFullName({
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                })
              )}
              {TypographyLead(profile.email)}
              {profile.age
                ? TypographyLead("Вік: " + profile.age)
                : TypographyLead("Вік: дані відсутні", "text-destructive")}
              {profile.gender
                ? TypographyLead(
                    "Стать: " +
                      (profile.gender === "male" ? "Чоловік" : "Жінка")
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
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                  })
                )}
                {TypographyLead(profile.email)}
                {profile.role === "admin"
                  ? TypographyH3("Адміністратор")
                  : null}
              </ItemContent>
            </Item>
            <Item
              variant="contrast"
              className="hidden md:block mr-6 hover:border-transparent hover:bg-muted/50 transition-colors duration-200"
            >
              <ItemContent>
                <ItemTitle>{TypographyH3(`Демографічна інформація`)}</ItemTitle>
                {profile.age
                  ? TypographyLead("Вік: " + profile.age)
                  : TypographyLead("Вік: дані відсутні", "text-destructive")}
                {profile.gender
                  ? TypographyLead(
                      "Стать: " +
                        (profile.gender === "male" ? "Чоловік" : "Жінка")
                    )
                  : TypographyLead("Стать: дані відсутні", "text-destructive")}
              </ItemContent>
            </Item>
          </CardTitle>
          <CardAction>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <EditProfileDialog profile={profile} />
              <ChangePasswordDialog />
              <DeleteAccountDialog />
              <LogoutDialog />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="w-full pb-4">
          <Tabs tabs={tabs} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
