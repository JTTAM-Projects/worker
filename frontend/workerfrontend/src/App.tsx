import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import TaskPage from "./pages/TaskPage";
import RootLayout from "./features/layoutcomponents/RootLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="tasks" element={<TaskPage />} />
      </Route>
    </Routes>
  );
}
