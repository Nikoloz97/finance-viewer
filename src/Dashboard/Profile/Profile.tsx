import "./Profile.css";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../ShadcnComponents/Avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ShadcnComponents/Tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ShadcnComponents/Card";
import Account from "./Account";
import Preferences from "./Preferences";

const Profile = () => {
  return (
    <div>
      <div className="Avatar-Caption-Container">
        <Avatar className="m-3">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>Guest</p>
      </div>
      <Tabs defaultValue="account" className="h-full p-3 dark Profile-Tabs">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                <Account />
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                <Preferences />
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
