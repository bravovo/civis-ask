import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Err403 from "../pages/error/403";
import RoleCheck from "../components/RoleCheck/RoleCheck";
import Err404 from "../pages/error/404";
import Main from "../pages/main/Main";
import Layout from "../layouts/Layout";
import Profile from "../pages/profile/Profile";
import NewSurvey from "../pages/newSurvey/NewSurvey";
import SurveyInfo from "../pages/survey-info/SurveyInfo";
import PassSurvey from "../pages/passSurvey/PassSurvey";

function Router() {
  return (
    <Routes>
      <Route
        path="/"
        index
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Layout>
              <Main />
            </Layout>
          </RoleCheck>
        }
      />
      <Route
        path="/profile"
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Layout hasHeader={false}>
              <Profile />
            </Layout>
          </RoleCheck>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Dashboard />{" "}
          </RoleCheck>
        }
      />
      <Route
        path="/new-survey"
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Layout>
              <NewSurvey />
            </Layout>
          </RoleCheck>
        }
      />
      <Route
        path="/survey-info/:surveyId"
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Layout>
              <SurveyInfo />
            </Layout>
          </RoleCheck>
        }
      />
      <Route
        path="/:surveyId/pass"
        element={
          <RoleCheck roles={["civis", "admin"]}>
            <Layout>
              <PassSurvey />
            </Layout>
          </RoleCheck>
        }
      />
      <Route path="/403" element={<Err403 />} />
      <Route path="*" element={<Err404 />} />
    </Routes>
  );
}

export default Router;
