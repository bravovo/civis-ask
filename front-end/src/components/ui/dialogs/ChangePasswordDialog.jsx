import { useState } from "react";
import { changePassword } from "../../../state/profileSlice";
import { useDispatch } from "react-redux";

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

function ChangePasswordDialog() {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleChangePassword(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!currentPassword || !newPassword) {
      toast.error("Будь ласка, заповніть всі поля");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Новий пароль повинен містити не менше 8 символів");
      return;
    }

    setIsSubmitting(true);

    try {
      const promise = dispatch(
        changePassword({ currentPassword, newPassword })
      ).unwrap();

      toast.promise(promise, {
        loading: "Зміна пароля...",
        success: () => {
          setCurrentPassword("");
          setNewPassword("");
          setOpen(false);
          return "Пароль успішно змінено";
        },
        error: (err) => err || "Помилка при зміні пароля",
      });

      await promise;

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Помилка при зміні пароля");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Змінити пароль</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleChangePassword} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Змінити пароль</DialogTitle>
            <DialogDescription>
              Для зміни паролю введіть поточний пароль та новий пароль
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="userCurrentPassword">Поточний пароль</Label>
              <Input
                id="userCurrentPassword"
                type="password"
                placeholder="Почніть вводити..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="userNewPassword">Новий пароль</Label>
              <Input
                id="userNewPassword"
                type="password"
                placeholder="Почніть вводити..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
            <Button type="submit" disabled={isSubmitting}>
              Зберегти зміни
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordDialog;
