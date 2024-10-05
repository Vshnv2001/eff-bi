import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/session";
import { recipeDetails } from "../../components/Authentication/Authentication";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface ILink {
    name: string;
    onClick: () => void;
    icon: string;
}

const Navbar = () => {
  const sessionContext = useSessionContext();

    if (sessionContext.loading === true) {
        return null;
    }

    const userId = sessionContext.userId;

    const navigate = useNavigate();

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    function openLink(url: string) {
        window.open(url, "_blank");
    }

    const links: ILink[] = [
        {
            name: "Blogs",
            onClick: () => openLink("https://supertokens.com/blog"),
            icon: 'a',
        },
        {
            name: "Documentation",
            onClick: () => openLink(recipeDetails.docsLink),
            icon: 'a',
        },
    ];

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    {links.map((link) => (
                        <div
                            key={link.name}
                            className="flex items-center cursor-pointer hover:text-orange-500"
                            onClick={link.onClick}
                        >
                            <img
                                className="h-5 w-5 mr-2"
                                src={link.icon}
                                alt={link.name}
                            />
                            <span>{link.name}</span>
                        </div>
                    ))}
                </div>

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
    )
}

export default Navbar;