import { useSelector } from "react-redux";

function Profile() {
    const user = useSelector((state) => state.auth.user);

    return <div>{user.email}</div>;
}

export default Profile;
