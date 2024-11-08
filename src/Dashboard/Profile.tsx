import "./Dashboard.css";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ShadcnComponents/Avatar";

const Profile = () => {
  return (
    <div className="Profile-Container">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Profile;
