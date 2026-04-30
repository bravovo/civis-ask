import { useDispatch, useSelector } from "react-redux";
import { formatUserFullName } from "../../utils/utils";
import { use, useEffect, useState } from "react";
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
import Popup from "../../components/ui/Popup/Popup";

const genders = [
  { value: "male", label: "Чоловік" },
  { value: "female", label: "Жінка" },
];

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userSurveys, passedSurveys, ...profile } = useSelector(
    (state) => state.profile
  );

  const [activeTab, setActiveTab] = useState("my_surveys");
  const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

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
      editProfileDialogOpen ||
      changePasswordDialogOpen ||
      deleteAccountDialogOpen
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [
    editProfileDialogOpen,
    changePasswordDialogOpen,
    deleteAccountDialogOpen,
  ]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  function renderTab() {
    if (activeTab === "my_surveys") {
      switch (profile.surveysStatus) {
        case "loading":
          return <Loader />;
        case "error":
          return <h3>{profile.error}</h3>;
        case "success":
          if (userSurveys.length === 0) {
            return <h3>У вас ще немає створених опитувань</h3>;
          }
          return (
            <div className="flex flex-col gap-2">
              {userSurveys.map((s) => (
                <SurveyCard key={s._id} data={s} fromProfile={true} />
              ))}
            </div>
          );
      }
    } else {
      switch (profile.passedSurveysStatus) {
        case "loading":
          return <Loader />;
        case "error":
          return <h3>{profile.error}</h3>;
        case "success":
          if (passedSurveys.length === 0) {
            return <h3>У вас ще немає пройдених опитувань</h3>;
          }
          return (
            <div className="flex flex-col gap-2">
              {passedSurveys.map((s) => (
                <SurveyCard
                  key={s._id}
                  data={s}
                  isSurveyTake={true}
                  fromProfile={true}
                />
              ))}
            </div>
          );
      }
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {profile.status !== "error" && profile.message && (
        <div className="w-full flex justify-center">
          <Popup text={profile.message} color="green" />
        </div>
      )}
      <button onClick={() => navigate(-1)} className="w-20">
        Назад
      </button>
      <div className="border-[1px] !font-normal rounded-2xl rounded-b-none border-zinc-400 pt-6 px-5 w-full flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h3>Електронна пошта: {profile.email}</h3>
            <h3>
              Повне ім'я:{" "}
              {formatUserFullName({
                firstName: profile.firstName,
                lastName: profile.lastName,
              })}
            </h3>
            {profile.role === "admin" ? <h3>Роль: Адмін</h3> : null}
            {profile.age ? <h3>Вік: {profile.age}</h3> : null}
            {profile.gender ? <h3>Стать: {profile.gender}</h3> : null}
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => setEditProfileDialogOpen(true)}>
              Змінити дані профілю
            </button>
            <button onClick={() => setChangePasswordDialogOpen(true)}>
              Змінити пароль
            </button>
            <button onClick={() => setDeleteAccountDialogOpen(true)}>
              Видалити акаунт
            </button>
          </div>
        </div>

        <div className="h-16 border-t-[1px] border-zinc-400 flex flex-row justify-between items-center-safe gap-2">
          <button
            className={`w-full !border-none hover:!shadow-none hover:!transform-none ${activeTab === "my_surveys" ? "!bg-gray-700 !text-white" : "hover:!bg-gray-400"}`}
            onClick={() => handleTabChange("my_surveys")}
          >
            Мої опитування
          </button>
          <button
            className={`w-full !border-none hover:!shadow-none hover:!transform-none ${activeTab === "passed_surveys" ? "!bg-gray-700 !text-white" : "hover:!bg-gray-400"}`}
            onClick={() => handleTabChange("passed_surveys")}
          >
            Пройдені опитування
          </button>
        </div>
        {renderTab()}
      </div>
      <EditProfileDialog
        profile={profile}
        open={editProfileDialogOpen}
        onClose={() => setEditProfileDialogOpen(false)}
      />
      <ChangePasswordDialog
        profile={profile}
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
      />
      <DeleteAccountDialog
        profile={profile}
        open={deleteAccountDialogOpen}
        onClose={() => setDeleteAccountDialogOpen(false)}
      />
    </div>
  );
}

export default Profile;
