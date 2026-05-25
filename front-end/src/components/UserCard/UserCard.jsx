import { formatUserFullName } from "../../utils/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser, patchUserRole } from "../../state/adminSlice";

import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

const roles = [
  { value: "civis", label: "Користувач" },
  { value: "admin", label: "Адміністратор" },
];

function UserCard({ data }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState(data.role);
  const link = `/admin/users`;

  async function handleUserDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const promise = dispatch(deleteUser(data._id)).unwrap();

      toast.promise(promise, {
        loading: "Видалення користувача...",
        success: () => {
          setDeleteDialogOpen(false);
          return "Користувач успішно видалений";
        },
        error: (err) => {
          return err.message || err || "Не вдалось видалити користувача";
        },
      });

      await promise;

      setDeleteDialogOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleUserEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;

    if (role === data.role) {
      toast.info("Немає змін для збереження");
      setEditDialogOpen(false);
      return;
    }

    setIsSubmitting(true);

    try {
      const promise = dispatch(
        patchUserRole({ userId: data._id, newRole: role })
      ).unwrap();

      toast.promise(promise, {
        loading: "Оновлення ролі користувача...",
        success: () => {
          setEditDialogOpen(false);
          return "Роль користувача успішно оновлена";
        },
        error: (err) => {
          return err.message || err || "Не вдалось оновити роль користувача";
        },
      });

      await promise;

      setEditDialogOpen(false);
    } catch (err) {
      // error is handled in toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => navigate(link)}
      className="w-full border border-transparent rounded-xl hover:border-border transition-colors duration-300 cursor-pointer"
    >
      <Card className="flex">
        <CardHeader className="flex justify-between items-start w-full">
          <div>
            <CardTitle>
              {formatUserFullName({
                firstName: data.firstName,
                lastName: data.lastName,
              })}
            </CardTitle>
            <CardDescription>
              Роль: {roles.find((r) => r.value === data.role)?.label}
            </CardDescription>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer flex "
                    onSelect={() => {
                      setEditDialogOpen(true);
                    }}
                  >
                    Редагувати
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer flex"
                    onSelect={() => {
                      setDeleteDialogOpen(true);
                    }}
                  >
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={handleUserEdit} className="space-y-6">
                    <DialogHeader>
                      <DialogTitle>Редагувати користувача</DialogTitle>
                      <DialogDescription>
                        Тут ви можете змінити дані про роль користувача
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="role">Роль</Label>
                        <Select
                          value={role}
                          onValueChange={(value) => setRole(value)}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Оберіть роль" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectGroup>
                              {roles.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Ви впевнені, що хочете видалити цього користувача?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Користувач та всі зібрані дані будуть назавжди видалені.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Скасувати</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleUserDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isSubmitting}
                  >
                    Видалити
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <a
            href={`mailto:${data.email}`}
            className="hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {data.email}
          </a>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <p>
            Дата створення акаунта:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-GB")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default UserCard;
