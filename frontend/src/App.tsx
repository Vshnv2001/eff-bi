import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import {
  SuperTokensConfig,
  ComponentWrapper,
} from "./components/Authentication/AuthenticationConfig";
import { AuthProvider } from "./components/Authentication/AuthenticationContext";
import Authentication from "./components/Authentication/Authentication";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import UploadPage from "./pages/ChatbotPage";
import FileUpload from "./pages/FileUploadPage";
import DashboardPage from "./pages/DashboardPage";
import FetchUserData from "./components/Authentication/FetchUserData";
import SaveUserData from "./components/Authentication/SaveUserData";
import DBSettingsPage from "./pages/DBSettingsPage";
import OrgSettingsPage from "./pages/OrgSettingsPage";
import DBAccessPermissionsPage from "./pages/DBAccessPermissionsPage";

SuperTokens.init(SuperTokensConfig);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/auth" element={<Authentication />} />
      <Route
        index
        element={
          <SessionAuth>
            <LandingPage />
          </SessionAuth>
        }
      />

      <Route
        path="/upload"
        element={
          <SessionAuth>
            <UploadPage />
          </SessionAuth>
        }
      />

      <Route
        path="/auth/save"
        element={
          <SessionAuth>
            <SaveUserData />
          </SessionAuth>
        }
      />

      <Route
        path="/auth/fetch"
        element={
          <SessionAuth>
            <FetchUserData />
          </SessionAuth>
        }
      />

      <Route path="/file/upload/" element={<FileUpload />} />
      <Route path="/settings/database" element={<DBSettingsPage />} />
      <Route path="/settings/organization" element={<OrgSettingsPage />} />
      <Route
        path="/settings/access-permissions"
        element={<DBAccessPermissionsPage />}
      />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <AuthProvider>
      <SuperTokensWrapper>
        <ComponentWrapper>
          <RouterProvider router={router} />
        </ComponentWrapper>
      </SuperTokensWrapper>
    </AuthProvider>
  );
};

export default App;