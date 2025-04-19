import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Grid,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from '@chakra-ui/react';

interface ROIInputs {
  propertyPrice: number;
  constructionCosts: number;
  chargingStations: number;
  electricityRate: number;
  utilizationRate: number;
  chargingRate: number;
  monthlyRent: number;
}

const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    propertyPrice: 500000,
    constructionCosts: 100000,
    chargingStations: 4,
    electricityRate: 0.12,
    utilizationRate: 30,
    chargingRate: 0.35,
    monthlyRent: 2000,
  });

  const [results, setResults] = useState({
    totalInvestment: 0,
    annualRevenue: 0,
    annualCosts: 0,
    netIncome: 0,
    roi: 0,
    paybackPeriod: 0,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const calculateROI = () => {
    const totalInvestment = inputs.propertyPrice + inputs.constructionCosts +
      (inputs.chargingStations * 50000); // Assuming $50k per charging station

    const hoursPerYear = 8760;
    const annualChargingRevenue = 
      inputs.chargingStations * 
      hoursPerYear * 
      (inputs.utilizationRate / 100) * 
      inputs.chargingRate * 
      50; // Assuming 50kW average charging rate

    const annualRentRevenue = inputs.monthlyRent * 12;
    const annualRevenue = annualChargingRevenue + annualRentRevenue;

    const annualElectricityCost = 
      inputs.chargingStations * 
      hoursPerYear * 
      (inputs.utilizationRate / 100) * 
      inputs.electricityRate * 
      50; // Assuming 50kW average power consumption

    const annualMaintenance = inputs.chargingStations * 2000; // $2000 per station per year
    const annualCosts = annualElectricityCost + annualMaintenance;

    const netIncome = annualRevenue - annualCosts;
    const roi = (netIncome / totalInvestment) * 100;
    const paybackPeriod = totalInvestment / netIncome;

    setResults({
      totalInvestment,
      annualRevenue,
      annualCosts,
      netIncome,
      roi,
      paybackPeriod,
    });
  };

  useEffect(() => {
    calculateROI();
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    
    toast({
      title: "ROI Report Generated",
      description: "Your ROI analysis report has been created successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    // Generate CSV of results
    const csvHeaders = ['Metric','Value'];
    const csvRows = [
      ['Total Investment', results.totalInvestment.toString()],
      ['Annual Revenue', results.annualRevenue.toString()],
      ['Annual Costs', results.annualCosts.toString()],
      ['Net Income', results.netIncome.toString()],
      ['ROI (%)', results.roi.toFixed(1)],
      ['Payback Period (years)', results.paybackPeriod.toFixed(1)],
    ];
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell.replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'roi_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Heading mb={6}>ROI Calculator</Heading>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <Heading size="md" mb={2}>Investment Parameters</Heading>
            
            <FormControl>
              <FormLabel>Property Price ($)</FormLabel>
              <NumberInput
                value={inputs.propertyPrice}
                onChange={(_, value) => handleInputChange('propertyPrice', value)}
                min={0}
                step={10000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Construction Costs ($)</FormLabel>
              <NumberInput
                value={inputs.constructionCosts}
                onChange={(_, value) => handleInputChange('constructionCosts', value)}
                min={0}
                step={5000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Number of Charging Stations</FormLabel>
              <NumberInput
                value={inputs.chargingStations}
                onChange={(_, value) => handleInputChange('chargingStations', value)}
                min={1}
                max={20}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Divider />

            <Heading size="md" mb={2}>Operating Parameters</Heading>

            <FormControl>
              <FormLabel>Electricity Rate ($/kWh)</FormLabel>
              <NumberInput
                value={inputs.electricityRate}
                onChange={(_, value) => handleInputChange('electricityRate', value)}
                min={0}
                max={1}
                step={0.01}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Utilization Rate (%)</FormLabel>
              <NumberInput
                value={inputs.utilizationRate}
                onChange={(_, value) => handleInputChange('utilizationRate', value)}
                min={0}
                max={100}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Charging Rate ($/kWh)</FormLabel>
              <NumberInput
                value={inputs.chargingRate}
                onChange={(_, value) => handleInputChange('chargingRate', value)}
                min={0}
                step={0.05}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Monthly Rent ($)</FormLabel>
              <NumberInput
                value={inputs.monthlyRent}
                onChange={(_, value) => handleInputChange('monthlyRent', value)}
                min={0}
                step={100}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={6} align="stretch">
            <Heading size="md">ROI Analysis</Heading>

            <Grid templateColumns="1fr 1fr" gap={4}>
              <Stat>
                <StatLabel>Total Investment</StatLabel>
                <StatNumber>${results.totalInvestment.toLocaleString()}</StatNumber>
                <StatHelpText>Initial capital required</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Annual Revenue</StatLabel>
                <StatNumber>${results.annualRevenue.toLocaleString()}</StatNumber>
                <StatHelpText>Projected yearly income</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Annual Costs</StatLabel>
                <StatNumber>${results.annualCosts.toLocaleString()}</StatNumber>
                <StatHelpText>Operating expenses</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Net Annual Income</StatLabel>
                <StatNumber>${results.netIncome.toLocaleString()}</StatNumber>
                <StatHelpText>Revenue - Costs</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>ROI</StatLabel>
                <StatNumber>{results.roi.toFixed(1)}%</StatNumber>
                <StatHelpText>Return on Investment</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Payback Period</StatLabel>
                <StatNumber>{results.paybackPeriod.toFixed(1)} years</StatNumber>
                <StatHelpText>Time to recover investment</StatHelpText>
              </Stat>
            </Grid>

            <Box mt={4}>
              <Button 
                colorScheme="brand" 
                size="lg" 
                width="100%" 
                onClick={handleGenerateReport}
                isLoading={isGenerating}
                loadingText="Generating Report"
              >
                Generate Report
              </Button>
            </Box>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
};

export default ROICalculator; 