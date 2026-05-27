import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUser } from "@/state/adminSlice";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getDatabaseData } from "@/state/utils";

function AdminDeleteUserAccountDialog({ userId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDeleteAccount(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const promise = dispatch(deleteUser(userId)).unwrap();

      toast.promise(promise, {
        loading: "Видалення акаунту...",
        success: () => {
          navigate("/admin/users", { state: { deletedAccount: true } });
          return "Акаунт успішно видалено";
        },
        error: (err) => err || "Помилка при видаленні акаунту",
      });

      await promise;

      setOpen(false);
      await getDatabaseData(dispatch);
    } catch (err) {
      // error is handled in toast
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild className="w-full">
        <Button variant="destructive" className="w-full">
          Видалити акаунт користувача
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ви впевнені, що хочете видалити акаунт користувача?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Всі дані користувача будуть стерті назавжди
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount}>
            Видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AdminDeleteUserAccountDialog;
