import axios from 'axios';

interface DashboardStats {
  totalSites: number;
  highRoiSites: number;
  readyForReview: number;
  activeProjects: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get<DashboardStats>('/api/stats/dashboard');
  return response.data;
}; 