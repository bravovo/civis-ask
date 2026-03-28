import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../../components/ui/Loader/Loader";
import { me } from "../../state/profileSlice";

function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loader);
  const { authChecked, token } = useSelector((state) => state.profile);

  useEffect(() => {
    if (!authChecked && token) {
      dispatch(me());
    }
  }, [authChecked, token, dispatch]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}

export default AuthProvider;
