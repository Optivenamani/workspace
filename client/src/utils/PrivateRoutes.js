import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// components
import Navbar from '../components/navbar/Navbar';

const PrivateRoutes = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  return token ? (
    <>
      <Navbar
        fullName={user.fullnames || 'Undefined'}
        department={user.department || 'Undefined'}
      />
      <ToastContainer />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
