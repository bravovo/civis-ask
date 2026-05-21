import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteAccount } from "../../../state/profileSlice";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Field, FieldGroup } from "@/components/ui/field";

function DeleteAccountDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDeleteAccount(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!password) {
      toast.error(
        "Будь ласка, введіть пароль для підтвердження видалення облікового запису"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const promise = dispatch(deleteAccount({ password })).unwrap();

      toast.promise(promise, {
        loading: "Видалення акаунту...",
        success: () => {
          setPassword("");
          navigate("/login", { state: { deletedAccount: true } });
          return "Акаунт успішно видалено";
        },
        error: (err) => err || "Помилка при видаленні акаунту",
      });

      await promise;

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Помилка при видаленні акаунту");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive">
          Видалити акаунт
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleDeleteAccount} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Видалити обліковий запис</DialogTitle>
            <DialogDescription>
              Для підтвердження видалення введіть пароль
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="userPassword">Пароль</Label>
              <Input
                id="userPassword"
                type="password"
                placeholder="Почніть вводити..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Скасувати
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              Видалити акаунт
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAccountDialog;
