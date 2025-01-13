import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';  // Import Login component
import Home from './components/Home';    // Import Home component
import SetLimit from './pages/Setlimit';
import Winning from './pages/Winning';
import Header from './components/Header'; // Import the Header component
// ProtectedRoute component that checks if the user is logged in
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  // If not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // If logged in, show the protected route
  return <>{element}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for login page */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute element={<><Header /><Home /></>} />
          } 
        />
        
        <Route 
          path="/SetLimit" 
          element={
            <ProtectedRoute element={<><Header /><SetLimit /></>} />
          } 
        />
        <Route 
          path="/Winning" 
          element={
            <ProtectedRoute element={<><Header /><Winning /></>} />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
