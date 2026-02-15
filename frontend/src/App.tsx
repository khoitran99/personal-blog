import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { BlogDetail } from './pages/BlogDetail';
import { Admin } from './pages/Admin';
import { Editor } from './pages/Editor';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/new" element={<Editor />} />
          <Route path="admin/edit/:id" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
