import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import ProjectDetail from './pages/ProjectDetail';
import LabourList from './pages/LabourList';
import WageManagement from './pages/WageManagement';
import './styles/global.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute roles={['SUPER_ADMIN', 'PROJECT_OWNER']}>
              <Layout>
                <ProjectList />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/projects/new" element={
            <PrivateRoute roles={['SUPER_ADMIN', 'PROJECT_OWNER']}>
              <Layout>
                <ProjectForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/projects/:id" element={
            <PrivateRoute roles={['SUPER_ADMIN', 'PROJECT_OWNER']}>
              <Layout>
                <ProjectDetail />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/labours" element={
            <PrivateRoute roles={['SUPER_ADMIN', 'PROJECT_OWNER']}>
              <Layout>
                <LabourList />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/wages" element={
            <PrivateRoute roles={['SUPER_ADMIN', 'PROJECT_OWNER']}>
              <Layout>
                <WageManagement />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
