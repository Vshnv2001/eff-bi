import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  //userId: string | null;
  //setUserId: (userId: string | null) => void;
  email: string;
  setEmail: (email: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  organizationId: string;
  setOrganizationId: (organizationId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with empty strings instead of null
  //const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");

  return (
    <AuthContext.Provider
      value={{
        //userId,
        //setUserId,
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        organizationId,
        setOrganizationId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
