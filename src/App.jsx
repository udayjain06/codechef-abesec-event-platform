import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { LoadingState } from "./components/Loading";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages are loaded only when needed, so students download less code.
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminShell = lazy(() => import("./components/admin/AdminShell"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ManageEvents = lazy(() => import("./pages/admin/ManageEvents"));
const CreateEvent = lazy(() => import("./pages/admin/CreateEvent"));
const EditEvent = lazy(() => import("./pages/admin/EditEvent"));
const Registrations = lazy(() => import("./pages/admin/Registrations"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingState />}>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetails />} />
            <Route path="register/:eventId" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="events/new" element={<CreateEvent />} />
            <Route path="events/:id/edit" element={<EditEvent />} />
            <Route path="registrations" element={<Registrations />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
