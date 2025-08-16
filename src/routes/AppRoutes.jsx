import { Route, Routes } from "react-router-dom";
import { AnalyticsPage } from "../pages/AnalyticsPage";
import { ExpensesPage } from "../pages/ExpensesPage";
import { LogOutPage } from "../pages/LogOutPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import SpendingPage from "../pages/SpendingPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import PrivateRoute from "./PrivateRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<ExpensesPage />}>
          <Route path="/analytic" element={<AnalyticsPage />} />
          <Route path="/logout" element={<LogOutPage />} />
        </Route>
        <Route path="/spending" element={<SpendingPage />} />
      </Route>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
