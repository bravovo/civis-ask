import { useDispatch, useSelector } from "react-redux";
import { me } from "./authSlice";
import { useEffect } from "react";
import Loader from "../../components/Loader/Loader";

function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.loader);
    const { authChecked, token } = useSelector((state) => state.auth);

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
