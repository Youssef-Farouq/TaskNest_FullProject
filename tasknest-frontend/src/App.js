import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import AddTask from './components/tasks/AddTask';
import EditTask from './components/tasks/EditTask';
import AdminDashboard from './pages/AdminDashboard';
import AddUser from './components/users/AddUser';
import EditUser from './components/users/EditUser';
import ViewUserTasks from './pages/ViewUserTasks';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />
        <Route path="/add-task" element={
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        } />
        <Route path="/edit-task/:id" element={
          <ProtectedRoute>
            <EditTask />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/add-user" element={
          <ProtectedRoute>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/edit-user/:id" element={
          <ProtectedRoute>
            <EditUser />
          </ProtectedRoute>
        } />
        <Route path="/view-user-tasks/:id" element={
          <ProtectedRoute>
            <ViewUserTasks />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;