import { useState } from "react";
import api from "../../../api/api";
import Dialog from "./Dialog";
import FormInput from "../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { deleteAccount } from "../../../state/profileSlice";
import Loader from "../Loader/Loader";

function DeleteAccountDialog({ profile, open, onClose }) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!profile.loading) {
      setError("");
      onClose();
    }
  };

  async function handleDeleteAccount(e) {
    e.preventDefault();

    if (!password) {
      setError(
        "Будь ласка, введіть пароль для підтвердження видалення облікового запису."
      );
      return;
    }

    dispatch(deleteAccount({ password }))
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        setError(err);
      });
  }

  return (
    <Dialog
      title={"Видалити обліковий запис"}
      open={open}
      onClose={handleClose}
    >
      {profile.loading && <Loader />}
      <form
        onSubmit={handleDeleteAccount}
        className="w-full flex flex-col justify-center items-center gap-3"
      >
        <FormInput
          title="Пароль"
          name="userPassword"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        {error && (
          <p className="text-red-500 w-full flex justify-start">{error}</p>
        )}
        <div className="w-full flex justify-end gap-2">
          <button type="submit">Видалити</button>
        </div>
      </form>
    </Dialog>
  );
}

export default DeleteAccountDialog;
