import {
  Routes,
  Route,
  BrowserRouter as Router,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { PreBuiltUIList, SuperTokensConfig, ComponentWrapper } from "./components/Authentication/config";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import * as reactRouterDom from "react-router-dom";

SuperTokens.init(SuperTokensConfig);

/*
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
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
*/

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {/* SuperTokens Routes for Auth */}
      {getSuperTokensRoutesForReactRouterDom(reactRouterDom, PreBuiltUIList)}

      {/* Landing Page, wrapped with SessionAuth */}
      <Route
        index
        element={
          <SessionAuth>
            <LandingPage />
          </SessionAuth>
        }
      />

      {/* Not Found Page */}
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


/*
function App() {
  return (
      <SuperTokensWrapper>
          <ComponentWrapper>
              <div className="App app-container">
                  <Router>
                      <div className="fill">
                          <Routes>
                              {getSuperTokensRoutesForReactRouterDom(reactRouterDom, PreBuiltUIList)}

                              <Route
                                  path="/"
                                  element={
                                      <SessionAuth>
                                          <LandingPage />
                                      </SessionAuth>
                                  }
                              />
                          </Routes>
                      </div>
                  </Router>
              </div>
          </ComponentWrapper>
      </SuperTokensWrapper>
  );
}
*/

export default App;


/*
    //"react": "^18.3.1",
    //"react-dom": "^18.3.1",
    //"react-router-dom": "^6.26.2",
    //"supertokens-auth-react": "^0.47.1",
    //"supertokens-web-js": "^0.13.0",
*/