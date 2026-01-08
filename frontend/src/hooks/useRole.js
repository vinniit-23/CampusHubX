import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';

export const useRole = () => {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isStudent: role === ROLES.STUDENT,
    isCollege: role === ROLES.COLLEGE,
    isRecruiter: role === ROLES.RECRUITER,
  };
};
