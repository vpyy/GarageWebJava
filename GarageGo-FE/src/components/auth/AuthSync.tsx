import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { loadUserFromStorage } from '../../store/slices/authSlice';
import { syncCartWithAuth } from '../../store/slices/cartSlice';

export const AuthSync: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Load user/token from localStorage on app start (persist login across refreshes)
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // Sync cart with authentication state
    dispatch(syncCartWithAuth(isAuthenticated));
  }, [isAuthenticated, dispatch]);

  return null; // This component doesn't render anything
};
