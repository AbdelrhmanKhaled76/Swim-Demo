import { Outlet } from 'react-router-dom';
import Nav from './layout/nav/nav';
import MobileNav from './layout/nav/mobileNav';
import Footer from './layout/footer/footer';

function App() {
  return (
    <div className="app-layout min-h-screen flex flex-col relative pb-[80px] md:pb-0">
      <Nav />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

export default App;
