import { Button } from "semantic-ui-react";
import { UseContextCheck } from "./CustomHooks/UseContextCheck";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { setUser, setIsUserSignedIn } = UseContextCheck();
  const navigate = useNavigate();

  const handleLogOut = () => {
    setUser(undefined);
    setIsUserSignedIn(false);
    navigate("/user/login");
  };
  return (
    <div>
      <div>Profile page</div>
      <Button onClick={handleLogOut} content="Log out" />
    </div>
  );
};

export default Profile;
