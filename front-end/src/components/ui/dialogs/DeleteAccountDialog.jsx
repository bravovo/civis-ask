import { useState } from "react";
import Dialog from "./Dialog";
import FormInput from "../FormInput/FormInput";
import { useDispatch } from "react-redux";
import { deleteAccount } from "../../../state/profileSlice";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

function DeleteAccountDialog({ profile, open, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleClose = () => {
    if (profile.status !== "loading") {
      setError("");
      setPassword("");
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
        navigate("/login", { state: { deletedAccount: true } });
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
      {profile.status === "loading" && <Loader />}
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
