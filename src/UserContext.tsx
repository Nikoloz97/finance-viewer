import { createContext, useState, useContext, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  isUserSignedIn: boolean;
  setIsUserSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
  isMonitor: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<any>(undefined);
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(false);

  const isDesktop = useMediaQuery({
    query: "(min-width: 1444px)",
  });

  const isMonitor = useMediaQuery({
    query: "(min-width: 1600px)",
  });

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isUserSignedIn,
        setIsUserSignedIn,
        isDesktop,
        isMonitor,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
