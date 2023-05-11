
import './App.css';
import Post from './components/DraggablePost/Post.jsx';
import Header from './components/Header/Header';
import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from './UserContext';
import Layout from './components/Layout/Layout';
import IndexPage from './pages/IndexPage/IndexPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AppearancePage from './pages/Appearance/AppearancePage';
import DrivePage from './pages/DrivePage/DrivePage';

function App() {
  return (
    <UserContextProvider> 
      <Routes>
        <Route path="/link-stack" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/link-stack/login" element={<LoginPage />} />
          <Route path="/link-stack/register" element={<RegisterPage />} />
          <Route path="/link-stack/:username" element={<ProfilePage />} />

        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
