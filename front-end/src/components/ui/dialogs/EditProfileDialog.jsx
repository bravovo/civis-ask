import { useState } from "react";
import Dialog from "./Dialog";
import FormInput from "../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { editProfile } from "../../../state/profileSlice";
import Loader from "../Loader/Loader";
import { useEffect } from "react";

const genders = [
  { value: "male", label: "Чоловік" },
  { value: "female", label: "Жінка" },
];

function EditProfileDialog({ profile, open, onClose }) {
  const dispatch = useDispatch();
  const getSelectedGenderOption = (gender) =>
    genders.find((g) => g.value === gender) || {
      value: "placeholder",
      label: "Оберіть стать",
    };
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [age, setAge] = useState(profile.age || "");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(
    getSelectedGenderOption(profile.gender)
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setAge(profile.age || "");
      setSelectedGender(getSelectedGenderOption(profile.gender));
      setGenderDropdownOpen(false);
      setError("");
    }
  }, [open, profile]);

  const handleClose = () => {
    if (profile.status !== "loading") {
      setError("");
      setGenderDropdownOpen(false);
      onClose();
    }
  };

  function handleSaveEditedProfile(e) {
    e.preventDefault();

    if (!firstName || !lastName || !age) {
      setError("Неможливо зберегти профіль. Будь ласка, заповніть всі поля.");
      return;
    }

    if (Number(age) < 16) {
      setError("Вік користувача повинен бути не менше 16 років.");
      return;
    }

    if (selectedGender.value === "placeholder") {
      setError("Будь ласка, виберіть стать.");
      return;
    }

    dispatch(
      editProfile({ firstName, lastName, age, gender: selectedGender.value })
    )
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        setError(err);
      });
  }

  return (
    <Dialog title={"Змінити дані профілю"} open={open} onClose={handleClose}>
      {profile.status === "loading" && <Loader />}
      <form
        onSubmit={handleSaveEditedProfile}
        className="w-full flex flex-col justify-center items-center gap-3"
      >
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
        {error && (
          <p className="text-red-500 w-full flex justify-start">{error}</p>
        )}
        <div className="w-full flex justify-end gap-2">
          <button type="submit">Зберегти</button>
        </div>
      </form>
    </Dialog>
  );
}

export default EditProfileDialog;
