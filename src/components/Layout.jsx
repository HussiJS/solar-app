import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';

const Layout = () => {
  const { user } = useAuth();

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-green-600">
            SolarPlanner
          </Link>
          <nav className="space-x-4 text-sm">
            <Link to="/">Home</Link>
            {user ? (
              <>
                <Link to="/account">My Account</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mt-6 px-4 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
