import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const Navbar = () => {
  const sessionContext = useSessionContext();

  if (sessionContext.loading === true || !sessionContext.userId) {
    return null;
  }

  const userId = sessionContext.userId;

  const navigate = useNavigate();

  async function logoutClicked() {
    await signOut();
    navigate("/auth");
  }

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          <div>Your userID is:</div>
          <div className="truncate max-w-xs">{userId}</div>
        </div>

        <div>
          <button
            onClick={logoutClicked}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
