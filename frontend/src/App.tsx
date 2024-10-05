/*
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import {
  PreBuiltUIList,
  SuperTokensConfig,
  ComponentWrapper,
} from "./components/Authentication/Authentication";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import * as reactRouterDom from "react-router-dom";

SuperTokens.init(SuperTokensConfig);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {getSuperTokensRoutesForReactRouterDom(reactRouterDom, PreBuiltUIList)}

      <Route
        index
        element={
          <SessionAuth>
            <LandingPage />
          </SessionAuth>
        }
      />
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
*/

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route index element={<LandingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

const App = () => {
  return (
        <RouterProvider router={router} />
  );
};

export default App;