import { useDispatch, useSelector } from "react-redux";
import { me } from "./authSlice";
import { useEffect } from "react";

function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const { authChecked, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!authChecked && token) {
            dispatch(me());
        }
    }, [authChecked, token, dispatch]);

    return children;
}

export default AuthProvider;
