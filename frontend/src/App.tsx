import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/theme-provider';
import { Home } from './pages/Home';
import { BlogDetail } from './pages/BlogDetail';
import { Admin } from './pages/Admin';
import { Editor } from './pages/Editor';
import { Login } from './pages/Login';
import { Toaster } from '@/components/ui/sonner';

import { HelmetProvider } from 'react-helmet-async';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route element={<PrivateRoute />}>
                <Route path="admin" element={<Admin />} />
                <Route path="admin/new" element={<Editor />} />
                <Route path="admin/edit/:id" element={<Editor />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
