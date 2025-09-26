import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TaskPage from "./pages/TaskPage";
import RootLayout from "./features/layoutcomponents/RootLayout";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tasks" element={<TaskPage />} />
      </Route>
    </Routes>
  );
}
