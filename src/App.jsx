
import './App.css';
import Post from './components/DraggablePost/Post.jsx';
import Header from './components/Header/Header';
import { Routes, Route } from "react-router-dom";
import Layout from './components/Layout/Layout';
import IndexPage from './pages/IndexPage/IndexPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
