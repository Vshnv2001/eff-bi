import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
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
import ChatbotPage from "./pages/ChatbotPage";
import FileUpload from "./pages/FileUploadPage";
import DashboardPage from "./pages/DashboardPage";
import FetchUserData from "./components/Authentication/FetchUserData";
import SaveUserData from "./components/Authentication/SaveUserData";
import DBSettingsPage from "./pages/DBSettingsPage";
import OrgSettingsPage from "./pages/OrgSettingsPage";
import DashboardsPage from "./pages/DashboardsPage";
import DBAccessPermissionsPage from "./pages/DBAccessPermissionsPage";
import NewTilePage from "./pages/NewTilePage";
import ExDashboardPage from "./pages/ExDashboardPage";

// Initialize SuperTokens
SuperTokens.init(SuperTokensConfig);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {/* Public Routes */}
      <Route path="/auth" element={<Authentication />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route index element={<LandingPage />} />
      <Route path="/auth/save" element={<SaveUserData />} />
      <Route path="/auth/fetch" element={<FetchUserData />} />

      {/* Protected Routes */}
      <Route
        element={
          <SessionAuth>
            <Outlet />
          </SessionAuth>
        }
      >
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/file/upload" element={<FileUpload />} />
        <Route path="/settings/database" element={<DBSettingsPage />} />
        <Route path="/settings/organization" element={<OrgSettingsPage />} />
        <Route path="/dashboards" element={<DashboardsPage />} />
        <Route path="/dashboards/:dashboardId" element={<DashboardPage />} />
        <Route
          path="/dashboards/:dashboardId/tiles/new"
          element={<NewTilePage />}
        />
        <Route path="/dashboard/demo" element={<ExDashboardPage />} />
        <Route
          path="/settings/access-permissions"
          element={<DBAccessPermissionsPage />}
        />
      </Route>
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
