import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import Map from '../components/Map';
import { useQuery } from 'react-query';
import axios from 'axios';

interface DashboardStats {
  totalSites: number;
  highRoiSites: number;
  readyForReview: number;
  activeProjects: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get('/api/stats/dashboard');
  return response.data;
};

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery('dashboardStats', fetchDashboardStats);

  if (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }

  const defaultStats = {
    totalSites: 150,
    highRoiSites: 45,
    readyForReview: 12,
    activeProjects: 8
  };

  const displayStats = stats || defaultStats;

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Total Sites</StatLabel>
          <StatNumber>{isLoading ? <Spinner size="sm" /> : displayStats.totalSites}</StatNumber>
          <StatHelpText>Potential Locations</StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>High ROI Sites</StatLabel>
          <StatNumber>{isLoading ? <Spinner size="sm" /> : displayStats.highRoiSites}</StatNumber>
          <StatHelpText>Above 15% ROI</StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Ready for Review</StatLabel>
          <StatNumber>{isLoading ? <Spinner size="sm" /> : displayStats.readyForReview}</StatNumber>
          <StatHelpText>Sites to Evaluate</StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <StatLabel>Active Projects</StatLabel>
          <StatNumber>{isLoading ? <Spinner size="sm" /> : displayStats.activeProjects}</StatNumber>
          <StatHelpText>In Development</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" height="500px">
          <Heading size="md" mb={4}>Site Map</Heading>
          <Map />
        </Box>
        
        <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Box>
            {[
              {
                action: 'Site Added',
                location: '789 Woodward Ave, Detroit',
                time: '2 hours ago'
              },
              {
                action: 'ROI Analysis',
                location: '456 Michigan Ave, Detroit',
                time: '4 hours ago'
              },
              {
                action: 'Documents Generated',
                location: '123 Grand River Ave, Detroit',
                time: '6 hours ago'
              },
              {
                action: 'Site Approved',
                location: '321 Warren Ave, Detroit',
                time: '1 day ago'
              }
            ].map((activity, index) => (
              <Box key={index} py={3} borderBottomWidth={index === 3 ? 0 : 1} borderColor="gray.200">
                <Text fontWeight="medium">{activity.action}</Text>
                <Text fontSize="sm" color="gray.600">{activity.location}</Text>
                <Text fontSize="xs" color="gray.500">{activity.time}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Dashboard; 