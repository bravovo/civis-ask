import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/ui/Loader/Loader";
import UserCard from "../../../components/UserCard/UserCard";

import { TypographyH2 } from "../../../utils/styles.jsx";
import EmptyComponent from "@/components/EmptyComponent/EmptyComponent";
import { getUsers } from "@/state/adminSlice";

function Users() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state.admin);
  const profile = useSelector((state) => state.profile);
  const usersToShow = state.users
    ? state.users.filter((user) => user._id !== profile._id)
    : [];

  useEffect(() => {
    if (!state.users || state.users.length === 0) {
      dispatch(getUsers());
    }
  }, [dispatch, state.users]);

  if (state.status === "loading") {
    return <Loader />;
  }

  if (state.status === "error") {
    return (
      <EmptyComponent
        title="Сталася помилка при завантаженні користувачів"
        description="Оновіть сторінку або перейдіть до перегляду опитувань"
        buttonText="Перейти до опитувань"
        buttonLink="/admin/surveys"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 px-3">
      {TypographyH2("Список користувачів")}
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        {state.status === "success" &&
        (!usersToShow || usersToShow.length === 0) ? (
          <EmptyComponent
            title="Користувачів не знайдено"
            description="Ви можете перейти до перегляду опитувань"
            buttonText="Перейти до опитувань"
            buttonLink="/admin/surveys"
          />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 pt-3">
            {usersToShow.map((user) => {
              return <UserCard key={user._id} data={user} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
