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
import Authentication from "./components/Authentication/Authentication";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import UploadPage from "./pages/UploadPage";
import DBSettingsPage from "./pages/DBSettingsPage";
import OrgSettingsPage from "./pages/OrgSettingsPage";
import DashboardsPage from "./pages/DashboardsPage";
import DashboardPage from "./pages/DashboardPage";
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
      <Route path="/settings/database" element={<DBSettingsPage />} />
      <Route path="/settings/organization" element={<OrgSettingsPage />} />
      <Route path="/dashboards" element={<DashboardsPage />} />
      <Route path="/dashboards/:dashboardId" element={<DashboardPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <SuperTokensWrapper>
      <ComponentWrapper>
        <RouterProvider router={router} />
      </ComponentWrapper>
    </SuperTokensWrapper>
  );
};

export default App;


// import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
// import MainLayout from "./layouts/MainLayout";
// import LandingPage from "./pages/LandingPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import LoginPage from "./pages/LoginPage";
// import SettingsPage from "./pages/SettingsPage";

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<MainLayout />}>
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/settings" element={<SettingsPage />} />
//       <Route index element={<LandingPage />} />
//       <Route path="*" element={<NotFoundPage />} />
//     </Route>
//   )
// );

// const App = () => {
//   return (
//         <RouterProvider router={router} />
//   );
// };

// export default App;