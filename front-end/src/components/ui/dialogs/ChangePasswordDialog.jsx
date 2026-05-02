import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import FormInput from "../FormInput/FormInput";
import { changePassword } from "../../../state/profileSlice";
import { useDispatch } from "react-redux";
import Loader from "../Loader/Loader";

function ChangePasswordDialog({ profile, open, onClose }) {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");

  const handleClose = () => {
    if (profile.status !== "loading") {
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    }
  };

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setError("Будь ласка, заповніть всі поля.");
      return;
    }

    dispatch(changePassword({ currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        setError(err);
      });
  }

  return (
    <Dialog title="Змінити пароль" open={open} onClose={handleClose}>
      {profile.status === "loading" && <Loader />}
      <form
        onSubmit={handleChangePassword}
        className="w-full flex flex-col justify-center items-center gap-3"
      >
        <FormInput
          title="Поточний пароль"
          name="userCurrentPassword"
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
          value={currentPassword}
        />
        <FormInput
          title="Новий пароль"
          name="userNewPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          value={newPassword}
        />
        {error && (
          <p className="text-red-500 w-full flex justify-start">{error}</p>
        )}
        <div className="w-full flex justify-end gap-2">
          <button type="submit">Змінити</button>
        </div>
      </form>
    </Dialog>
  );
}

export default ChangePasswordDialog;
