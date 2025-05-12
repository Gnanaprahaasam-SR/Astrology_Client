import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, Outlet, HashRouter, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
// import Aos from 'aos';
// import "aos/dist/aos.css";
import { Error } from './components/Alert';
import { logout } from './redux/userInfo/userInfo';
import Admin from './pages/Admin';
import axios from 'axios';
import JathagamService from './pages/Jathagam';

const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Service = lazy(() => import('./pages/Service'));
const BookingService = lazy(() => import('./pages/Booking'));
const PrasanamService = lazy(() => import('./pages/PrasanamService'));
const MyBooking = lazy(() => import('./pages/MyBooking'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Header = lazy(() => import("./components/Nav"));
const Loader = lazy(() => import("./components/Loader"));
import PageLoader from "./components/PageLoader"

const ApiUrl = import.meta.env.VITE_APP_RSP_SERVER;


function App() {

  const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
  const userRole = useSelector((state) => state.user?.user)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const VerifySession = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${ApiUrl}/api/sessionVerification`, {
        headers: { "Content-Type": "appplication/json" },
        withCredentials: true,
      });

    } catch (error) {
      // console.log(error.message);
      const status = error.response?.status;
      if (status === 429) {
        Error('Too many Requests, Try for some other time')
      }
      else if (status === 401) {
        Error('Session timed out')
        setTimeout(() => {
          dispatch(logout());
        }, 200);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    VerifySession();
  }, [])

  const ServiceLayout = () => (
    <>
      <Header />
      <Outlet />
    </>
  );


  function SuspenseWithMinDelay({ children, fallback, minDuration }) {
    const [showFallback, setShowFallback] = React.useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setShowFallback(false), minDuration);
      return () => clearTimeout(timer);
    }, [minDuration]);

    return (
      <Suspense fallback={fallback}>
        {showFallback ? fallback : children}
      </Suspense>
    );
  }


  return (
    <>
      <ToastContainer />
      <SuspenseWithMinDelay fallback={<PageLoader />} minDuration={5000}>
        {loading && <Loader />}
        <HashRouter>

          <Routes>
            <Route path="/SignUp" element={isAuthenticated ? (userRole.profileType === "Admin" ? <Navigate to="/" /> : <Navigate to="/Services" />) : <SignUp />} />
            <Route path="/SignIn" element={isAuthenticated ? (userRole.profileType === "Admin" ? <Navigate to="/" /> : <Navigate to="/Services" />) : <SignIn />} />

            <Route path="/" element={isAuthenticated === true ? <ServiceLayout /> : <Navigate to="/SignIn" />}>
              <Route index element={<Dashboard />} />
              <Route path='/Services' element={<Service />} />
              <Route path="/Services/Request/:category" element={<BookingService />} />
              <Route path="/Services/:category" element={<PrasanamService />} />
              <Route path="/Services/Jathagam" element={<JathagamService />} />
              <Route path='/MyBooking' element={<MyBooking />} />
              <Route path='/Admin' element={<Admin />} />
            </Route>
            {/* <Route path="/loader" element={<PageLoader />} /> */}
          </Routes>

        </HashRouter>
      </SuspenseWithMinDelay>
    </>
  );
}

export default App;