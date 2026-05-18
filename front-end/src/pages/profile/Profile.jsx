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

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH2, TypographyH3 } from "../../utils/styles";
import LogoutDialog from "@/components/ui/dialogs/LogoutDialog";

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
    toast.error(profile.error || "Помилка при завантаженні даних");
    return;
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
        <CardHeader className="w-full flex justify-between items-center">
          <CardTitle>
            {TypographyH3(
              formatUserFullName({
                firstName: profile.firstName,
                lastName: profile.lastName,
              })
            )}
            {TypographyH3(profile.email)}
            {profile.role === "admin" ? TypographyH3("Адміністратор") : null}
            {profile.age ? TypographyH3("Вік: " + profile.age) : null}
            {profile.gender
              ? TypographyH3(
                  "Стать: " + (profile.gender === "male" ? "Чоловік" : "Жінка")
                )
              : null}
          </CardTitle>
          <CardAction>
            <div className="flex flex-col gap-4">
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
