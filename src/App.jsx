import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectSetup from './pages/ProjectSetup';
import EnergyEstimate from './pages/EnergyEstimate';
import ROICalculator from './pages/ROICalculator';
import Quote from './pages/Quote';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="project-setup" element={<ProjectSetup />} />
          <Route path="energy-estimate" element={<EnergyEstimate />} />
          <Route path="roi-calculator" element={<ROICalculator />} />
          <Route path="quote" element={<Quote />} />
          
          {/* Protected routes */}
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
