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
import TablePermissionsPage from "./pages/TablePermissionsPage";
import ViewDataPage from "./pages/ViewDataPage";
import FaqPage from "./pages/FaqPage";

// Initialize SuperTokens
SuperTokens.init(SuperTokensConfig);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/auth" element={<Authentication />} />
      <Route
        path="/chatbot"
        element={
          <SessionAuth>
            <ChatbotPage />
          </SessionAuth>
        }
      />
      <Route
        path="/file/upload"
        element={
          <SessionAuth>
            <FileUpload />
          </SessionAuth>
        }
      />
      <Route
        path="/settings/database"
        element={
          <SessionAuth>
            <DBSettingsPage />
          </SessionAuth>
        }
      />
      <Route
        path="/settings/organization"
        element={
          <SessionAuth>
            <OrgSettingsPage />
          </SessionAuth>
        }
      />
      <Route
        path="/dashboards"
        element={
          <SessionAuth>
            <DashboardsPage />
          </SessionAuth>
        }
      />
      <Route
        path="/dashboards/:dashboardId"
        element={
          <SessionAuth>
            <DashboardPage />
          </SessionAuth>
        }
      />
      <Route
        path="/dashboards/:dashboardId/tiles/new"
        element={
          <SessionAuth>
            <NewTilePage />
          </SessionAuth>
        }
      />
      <Route
        path="/dashboard/demo"
        element={
          <SessionAuth>
            <ExDashboardPage />
          </SessionAuth>
        }
      />
      <Route
        path="/settings/access-permissions"
        element={
          <SessionAuth>
            <DBAccessPermissionsPage />
          </SessionAuth>
        }
      />
      <Route
        path="/settings/table-permissions"
        element={
          <SessionAuth>
            <TablePermissionsPage />
          </SessionAuth>
        }
      />
      <Route
        path="/view-data"
        element={
          <SessionAuth>
            <ViewDataPage />
          </SessionAuth>
        }
      />
      <Route
        path="/faq"
        element={
          <SessionAuth>
            <FaqPage />
          </SessionAuth>
        }
      />

      <Route path="/auth" element={<Authentication />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route index element={<LandingPage />} />
      <Route path="/auth/save" element={<SaveUserData />} />
      <Route path="/auth/fetch" element={<FetchUserData />} />
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