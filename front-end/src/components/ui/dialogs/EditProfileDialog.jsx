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

  function handleSaveEditedProfile(e) {
    e.preventDefault();

    if (!firstName || !lastName || !age) {
      toast.error("Неможливо зберегти профіль. Будь ласка, заповніть всі поля");
      return;
    }

    if (Number(age) < 16) {
      toast.error("Вік користувача повинен бути не менше 16 років");
      return;
    }

    if (gender === "Оберіть стать") {
      toast.error("Будь ласка, виберіть стать");
      return;
    }

    const promise = dispatch(
      editProfile({ firstName, lastName, age, gender: gender })
    ).unwrap();

    toast.promise(promise, {
      loading: "Оновлення профілю...",
      success: () => {
        setOpen(false);
        return "Профіль успішно оновлено";
      },
      error: (err) => err || "Помилка при оновленні профілю",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Змінити дані профілю</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSaveEditedProfile} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Редагувати профіль</DialogTitle>
            <DialogDescription>
              Тут ви можете змінити свої персональні дані. Для зміни паролю або
              видалення акаунта натисніть відповідні кнопки
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="age">Ім'я</Label>
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
              <Label htmlFor="age">Прізвище</Label>
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
            <Button type="submit">Зберегти зміни</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProfileDialog;
