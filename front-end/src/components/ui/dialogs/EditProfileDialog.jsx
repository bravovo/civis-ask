import { useState } from "react";
import { useDispatch } from "react-redux";
import { editProfile } from "../../../state/profileSlice";

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Field, FieldGroup } from "@/components/ui/field";

const genders = [
  { value: "male", label: "Чоловік" },
  { value: "female", label: "Жінка" },
];

function EditProfileDialog({ profile }) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [age, setAge] = useState(profile.age || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSaveEditedProfile(e) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!firstName || !lastName || !age || !gender) {
      toast.error("Неможливо зберегти профіль. Будь ласка, заповніть всі поля");
      return;
    }

    if (Number(age) < 16) {
      toast.error("Вік користувача повинен бути не менше 16 років");
      return;
    }

    setIsSubmitting(true);

    try {
      const promise = dispatch(
        editProfile({ firstName, lastName, age: Number(age), gender })
      ).unwrap();

      toast.promise(promise, {
        loading: "Оновлення профілю...",
        success: "Профіль успішно оновлено",
        error: (err) => err || "Помилка при оновленні профілю",
      });

      await promise;

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Помилка при оновленні профілю");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="px-2 md:px-8">
          Змінити дані
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSaveEditedProfile} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Редагувати профіль</DialogTitle>
            <DialogDescription>
              Тут ви можете змінити свої персональні дані. Для зміни паролю або
              видалення акаунта натисніть відповідні кнопки
            </DialogDescription>
            {(!profile.age || !profile.gender) && (
              <Alert className="max-w-md border-amber-900 bg-amber-950 text-amber-50">
                <AlertTriangleIcon />
                <AlertTitle>
                  У вас відсутня інформація про вік або стать
                </AlertTitle>
                <AlertDescription>
                  Будь ласка, додайте ці дані, щоб мати можливість проходити
                  опитування
                </AlertDescription>
              </Alert>
            )}
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="userFirstName">Ім'я</Label>
              <Input
                id="userFirstName"
                type="text"
                placeholder="Ім'я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="userLastName">Прізвище</Label>
              <Input
                id="userLastName"
                type="text"
                placeholder="Прізвище"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="age">Вік</Label>
              <Input
                id="age"
                type="number"
                placeholder="16"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={16}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="gender">Стать</Label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Оберіть стать" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {genders.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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

export default EditProfileDialog;
