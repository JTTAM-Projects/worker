import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import TaskPage from "./pages/TaskPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import MyTasksPage from "./pages/MyTasksPage";
import ActiveApplicationsPage from "./pages/ActiveApplicationsPage";
import AcceptedApplicationsPage from "./pages/AcceptedApplicationsPage";
import PastApplicationsPage from "./pages/PastApplicationsPage";
import RootLayout from "./features/layoutcomponents/RootLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="tasks" element={<TaskPage />} />
        <Route path="create-task" element={<CreateTaskPage />} />
        <Route path="my-tasks" element={<MyTasksPage />} />
        <Route
          path="active-applications"
          element={<ActiveApplicationsPage />}
        />
        <Route
          path="accepted-applications"
          element={<AcceptedApplicationsPage />}
        />
        <Route path="past-applications" element={<PastApplicationsPage />} />
      </Route>
    </Routes>
  );
}
