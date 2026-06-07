import { Outlet, useLocation } from 'react-router-dom';
import Nav from './layout/nav/nav';
import MobileNav from './layout/nav/mobileNav';
import Footer from './layout/footer/footer';

function App() {
  const location = useLocation();
  const publicRoutes = ['/', '/home', '/signin', '/signup'];
  const isAuthRoute = !publicRoutes.includes(location.pathname.toLowerCase());
  const variant = isAuthRoute ? 'auth' : 'public';

  return (
    <div className="app-layout min-h-screen flex flex-col relative pb-[80px] md:pb-0">
      <Nav variant={variant} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer variant={variant} />
      <MobileNav variant={variant} />
    </div>
  )
}

export default App;
