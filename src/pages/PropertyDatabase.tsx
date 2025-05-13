import React, { useState, useRef } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  HStack,
  Badge,
  Button,
  VStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  Flex,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiClock, FiDownload, FiFileText, FiMap, FiRefreshCw } from 'react-icons/fi';

interface Property {
  id: string;
  address: string;
  zipcode: string;
  city: string;
  type: string;
  size: number;
  zoning: string;
  score: number;
  status: string;
  gridInfo: {
    currentPower: number; // in kW
    currentVoltage: number; // in Volts
    needsUpgrade: boolean;
    upgradeDetails?: string;
  };
  evChargerSupport: {
    level1: boolean;
    level2: boolean;
    dcFast: boolean;
    maxChargers: number;
  };
}

// Extended property for modal details
interface PropertyDetail extends Property {
  upgradeCost?: number;
  upgradeDuration?: number;
  recommendedOption?: string;
  savingsEstimate?: number;
  timeSavings?: number;
}

// New interface for permit proposal
interface PermitProposal {
  propertyId: string;
  permitType: string;
  requiredDocuments: string[];
  estimatedFees: number;
  estimatedTimeline: number;
  localRequirements: string[];
  inspectionRequirements: string[];
  notes: string;
}

// New interface for site comparison results
interface SiteComparisonResult {
  bestLocations: PropertyDetail[];
  alternativeLocations: PropertyDetail[];
  totalCostSavings: number;
  totalTimeSavings: number;
  zipCodes: {[key: string]: {best: PropertyDetail | null, alternatives: PropertyDetail[]}};
}

const sampleProperties: PropertyDetail[] = [
  {
    id: '1',
    address: '1001 Woodward Ave',
    zipcode: '48226',
    city: 'Detroit',
    type: 'Commercial',
    size: 12500,
    zoning: 'B4',
    score: 85,
    status: 'Available',
    gridInfo: {
      currentPower: 75,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 8
    }
  },
  {
    id: '2',
    address: '2051 Rosa Parks Blvd',
    zipcode: '48216',
    city: 'Detroit',
    type: 'Industrial',
    size: 25000,
    zoning: 'M1',
    score: 92,
    status: 'Under Review',
    gridInfo: {
      currentPower: 150,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 15
    }
  },
  {
    id: '3',
    address: '440 Burroughs St',
    zipcode: '48202',
    city: 'Detroit',
    type: 'Retail',
    size: 8500,
    zoning: 'B3',
    score: 78,
    status: 'Available',
    gridInfo: {
      currentPower: 45,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Requires transformer upgrade for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 35000,
    upgradeDuration: 45,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 35000,
    timeSavings: 45
  },
  {
    id: '4',
    address: '1401 Michigan Ave',
    zipcode: '48216',
    city: 'Detroit',
    type: 'Commercial',
    size: 15000,
    zoning: 'B4',
    score: 88,
    status: 'Under Contract',
    gridInfo: {
      currentPower: 90,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 10
    }
  },
  {
    id: '5',
    address: '5057 Woodward Ave',
    zipcode: '48202',
    city: 'Detroit',
    type: 'Industrial',
    size: 32000,
    zoning: 'M2',
    score: 82,
    status: 'Available',
    gridInfo: {
      currentPower: 200,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 20
    }
  },
  {
    id: '6',
    address: '4265 Woodward Ave',
    zipcode: '48201',
    city: 'Detroit',
    type: 'Retail',
    size: 6800,
    zoning: 'B2',
    score: 90,
    status: 'Under Review',
    gridInfo: {
      currentPower: 40,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Requires panel upgrade for Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 15000,
    upgradeDuration: 20,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 15000,
    timeSavings: 20
  },
  {
    id: '7',
    address: '1528 Woodward Ave',
    zipcode: '48226',
    city: 'Detroit',
    type: 'Commercial',
    size: 11500,
    zoning: 'B4',
    score: 86,
    status: 'Available',
    gridInfo: {
      currentPower: 60,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 8
    },
    upgradeCost: 40000,
    upgradeDuration: 60,
    recommendedOption: 'Level 2 chargers (no upgrade required)',
    savingsEstimate: 40000,
    timeSavings: 60
  },
  {
    id: '8',
    address: '2643 Park Ave',
    zipcode: '48201',
    city: 'Detroit',
    type: 'Parking',
    size: 18000,
    zoning: 'P1',
    score: 79,
    status: 'Available',
    gridInfo: {
      currentPower: 30,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'New service line required for multiple chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 22000,
    upgradeDuration: 30,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 22000,
    timeSavings: 30
  },
  {
    id: '9',
    address: '3434 Russell St',
    zipcode: '48207',
    city: 'Detroit',
    type: 'Retail',
    size: 7200,
    zoning: 'B3',
    score: 84,
    status: 'Under Review',
    gridInfo: {
      currentPower: 50,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Panel upgrade needed for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 28000,
    upgradeDuration: 35,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 28000,
    timeSavings: 35
  },
  {
    id: '10',
    address: '6200 Second Ave',
    zipcode: '48202',
    city: 'Detroit',
    type: 'Industrial',
    size: 42000,
    zoning: 'M1',
    score: 91,
    status: 'Under Contract',
    gridInfo: {
      currentPower: 180,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 18
    }
  },
  {
    id: '11',
    address: '1505 Woodward Ave',
    zipcode: '48226',
    city: 'Detroit',
    type: 'Commercial',
    size: 13500,
    zoning: 'B4',
    score: 87,
    status: 'Available',
    gridInfo: {
      currentPower: 65,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 9
    }
  },
  {
    id: '12',
    address: '8701 W Vernor Hwy',
    zipcode: '48209',
    city: 'Detroit',
    type: 'Retail',
    size: 5800,
    zoning: 'B2',
    score: 81,
    status: 'Under Review',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Requires transformer upgrade for Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 18000,
    upgradeDuration: 25,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 18000,
    timeSavings: 25
  },
  {
    id: '13',
    address: '500 Temple St',
    zipcode: '48201',
    city: 'Detroit',
    type: 'Parking',
    size: 22000,
    zoning: 'P1',
    score: 77,
    status: 'Available',
    gridInfo: {
      currentPower: 25,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'New service upgrade required for any Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 8
    },
    upgradeCost: 25000,
    upgradeDuration: 30,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 25000,
    timeSavings: 30
  },
  {
    id: '14',
    address: '1600 Clay St',
    zipcode: '48211',
    city: 'Detroit',
    type: 'Industrial',
    size: 38000,
    zoning: 'M2',
    score: 89,
    status: 'Under Review',
    gridInfo: {
      currentPower: 150,
      currentVoltage: 480,
      needsUpgrade: false,
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 15
    }
  },
  {
    id: '15',
    address: '1445 Adelaide St',
    zipcode: '48207',
    city: 'Detroit',
    type: 'Commercial',
    size: 9800,
    zoning: 'B3',
    score: 83,
    status: 'Available',
    gridInfo: {
      currentPower: 55,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Transformer upgrade required for DC fast chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 30000,
    upgradeDuration: 40,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 30000,
    timeSavings: 40
  },
  {
    id: '16',
    address: '220 S Main St',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Commercial',
    size: 8700,
    zoning: 'D1',
    score: 92,
    status: 'Available',
    gridInfo: {
      currentPower: 95,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 10
    }
  },
  {
    id: '17',
    address: '401 Depot St',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Industrial',
    size: 18500,
    zoning: 'M1',
    score: 85,
    status: 'Under Review',
    gridInfo: {
      currentPower: 120,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 12
    }
  },
  {
    id: '18',
    address: '2230 Platt Rd',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Retail',
    size: 7200,
    zoning: 'C2B',
    score: 79,
    status: 'Available',
    gridInfo: {
      currentPower: 40,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Panel upgrade required for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 25000,
    upgradeDuration: 30,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 25000,
    timeSavings: 30
  },
  {
    id: '19',
    address: '210 S 5th Ave',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Parking',
    size: 25000,
    zoning: 'P',
    score: 88,
    status: 'Available',
    gridInfo: {
      currentPower: 50,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Transformer upgrade needed for multiple Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 8
    },
    upgradeCost: 32000,
    upgradeDuration: 45,
    recommendedOption: 'Limited Level 2 chargers (partial upgrade)',
    savingsEstimate: 18000,
    timeSavings: 25
  },
  {
    id: '20',
    address: '35 Louis Campau St NW',
    zipcode: '49503',
    city: 'Grand Rapids',
    type: 'Commercial',
    size: 11200,
    zoning: 'TN-CC',
    score: 91,
    status: 'Under Review',
    gridInfo: {
      currentPower: 85,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 9
    }
  },
  {
    id: '21',
    address: '700 Ottawa Ave NW',
    zipcode: '49503',
    city: 'Grand Rapids',
    type: 'Industrial',
    size: 29500,
    zoning: 'TN-TCC',
    score: 84,
    status: 'Available',
    gridInfo: {
      currentPower: 175,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 16
    }
  },
  {
    id: '22',
    address: '1345 Monroe Ave NW',
    zipcode: '49505',
    city: 'Grand Rapids',
    type: 'Retail',
    size: 6100,
    zoning: 'TN-TBA',
    score: 76,
    status: 'Under Contract',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Service upgrade required for Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 17500,
    upgradeDuration: 21,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 17500,
    timeSavings: 21
  },
  {
    id: '23',
    address: '2650 East Beltline Ave SE',
    zipcode: '49546',
    city: 'Grand Rapids',
    type: 'Commercial',
    size: 14800,
    zoning: 'C2',
    score: 88,
    status: 'Available',
    gridInfo: {
      currentPower: 75,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 8
    }
  },
  {
    id: '24',
    address: '496 W Circle Dr',
    zipcode: '48824',
    city: 'East Lansing',
    type: 'Commercial',
    size: 12500,
    zoning: 'B2',
    score: 85,
    status: 'Under Review',
    gridInfo: {
      currentPower: 70,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 7
    }
  },
  {
    id: '25',
    address: '300 M.A.C. Ave',
    zipcode: '48823',
    city: 'East Lansing',
    type: 'Retail',
    size: 5300,
    zoning: 'B3',
    score: 79,
    status: 'Available',
    gridInfo: {
      currentPower: 30,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Panel upgrade needed for multiple Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 3
    },
    upgradeCost: 14000,
    upgradeDuration: 18,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 14000,
    timeSavings: 18
  },
  {
    id: '26',
    address: '124 W Allegan St',
    zipcode: '48933',
    city: 'Lansing',
    type: 'Commercial',
    size: 9800,
    zoning: 'G1',
    score: 82,
    status: 'Available',
    gridInfo: {
      currentPower: 60,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    }
  },
  {
    id: '27',
    address: '2000 Merritt Rd',
    zipcode: '48911',
    city: 'Lansing',
    type: 'Industrial',
    size: 34000,
    zoning: 'F',
    score: 86,
    status: 'Under Contract',
    gridInfo: {
      currentPower: 220,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 20
    }
  },
  {
    id: '28',
    address: '1982 W Grand River Ave',
    zipcode: '48906',
    city: 'Lansing',
    type: 'Retail',
    size: 7600,
    zoning: 'F1',
    score: 77,
    status: 'Available',
    gridInfo: {
      currentPower: 45,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Service upgrade required for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 28500,
    upgradeDuration: 35,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 28500,
    timeSavings: 35
  },
  {
    id: '29',
    address: '501 Saginaw St',
    zipcode: '48502',
    city: 'Flint',
    type: 'Commercial',
    size: 10800,
    zoning: 'D-3',
    score: 78,
    status: 'Available',
    gridInfo: {
      currentPower: 55,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Transformer upgrade required for Level 2 and DC chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 26000,
    upgradeDuration: 32,
    recommendedOption: 'Level 1 chargers initially, phased upgrade for Level 2',
    savingsEstimate: 16000,
    timeSavings: 20
  },
  {
    id: '30',
    address: '4520 Corunna Rd',
    zipcode: '48532',
    city: 'Flint',
    type: 'Retail',
    size: 8200,
    zoning: 'D-2',
    score: 81,
    status: 'Under Review',
    gridInfo: {
      currentPower: 50,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 5
    }
  },
  {
    id: '31',
    address: '3213 Industrial Ave',
    zipcode: '48506',
    city: 'Flint',
    type: 'Industrial',
    size: 27500,
    zoning: 'D-4',
    score: 83,
    status: 'Available',
    gridInfo: {
      currentPower: 160,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 14
    }
  },
  {
    id: '32',
    address: '1720 S Garfield Ave',
    zipcode: '49684',
    city: 'Traverse City',
    type: 'Commercial',
    size: 9400,
    zoning: 'C-2',
    score: 87,
    status: 'Available',
    gridInfo: {
      currentPower: 65,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 7
    }
  },
  {
    id: '33',
    address: '3850 N US 31 S',
    zipcode: '49685',
    city: 'Traverse City',
    type: 'Retail',
    size: 11200,
    zoning: 'C-3',
    score: 84,
    status: 'Under Contract',
    gridInfo: {
      currentPower: 60,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Service upgrade needed for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 8
    },
    upgradeCost: 32000,
    upgradeDuration: 38,
    recommendedOption: 'Level 2 chargers only (no upgrade required)',
    savingsEstimate: 32000,
    timeSavings: 38
  },
  {
    id: '34',
    address: '101 N Washington Ave',
    zipcode: '48602',
    city: 'Saginaw',
    type: 'Commercial',
    size: 8800,
    zoning: 'C-2',
    score: 76,
    status: 'Available',
    gridInfo: {
      currentPower: 45,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Panel and transformer upgrades needed'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 24000,
    upgradeDuration: 28,
    recommendedOption: 'Level 1 chargers only (no upgrade required)',
    savingsEstimate: 24000,
    timeSavings: 28
  },
  {
    id: '35',
    address: '301 S Washington Ave',
    zipcode: '48607',
    city: 'Saginaw',
    type: 'Parking',
    size: 19500,
    zoning: 'C-3',
    score: 80,
    status: 'Under Review',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'New service line required for multiple chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 7
    },
    upgradeCost: 29000,
    upgradeDuration: 34,
    recommendedOption: 'Limited Level 1 chargers initially, phased upgrade',
    savingsEstimate: 19000,
    timeSavings: 24
  },
  {
    id: '36',
    address: '2001 Woodward Ave',
    zipcode: '48226',
    city: 'Detroit',
    type: 'Commercial',
    size: 14800,
    zoning: 'B4',
    score: 89,
    status: 'Available',
    gridInfo: {
      currentPower: 45,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Transformer and panel upgrade required for DC Fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 48000,
    upgradeDuration: 55,
    recommendedOption: 'Level 2 chargers only until upgrade complete',
    savingsEstimate: 48000,
    timeSavings: 55
  },
  {
    id: '37',
    address: '1700 Michigan Ave',
    zipcode: '48216',
    city: 'Detroit',
    type: 'Commercial',
    size: 16200,
    zoning: 'B4',
    score: 82,
    status: 'Available',
    gridInfo: {
      currentPower: 65,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Significant service upgrade needed for multiple Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 42000,
    upgradeDuration: 60,
    recommendedOption: 'Limited Level 2 chargers initially',
    savingsEstimate: 22000,
    timeSavings: 30
  },
  {
    id: '38',
    address: '2500 Bagley St',
    zipcode: '48216',
    city: 'Detroit',
    type: 'Retail',
    size: 9200,
    zoning: 'B3',
    score: 80,
    status: 'Available',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'New utility connection required for Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 38000,
    upgradeDuration: 50,
    recommendedOption: 'Level 1 chargers only until upgrade complete',
    savingsEstimate: 38000,
    timeSavings: 50
  },
  {
    id: '39',
    address: '5100 Cass Ave',
    zipcode: '48202',
    city: 'Detroit',
    type: 'Commercial',
    size: 10800,
    zoning: 'B4',
    score: 87,
    status: 'Available',
    gridInfo: {
      currentPower: 100,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 12
    }
  },
  {
    id: '40',
    address: '460 W Baltimore St',
    zipcode: '48202',
    city: 'Detroit',
    type: 'Commercial',
    size: 7800,
    zoning: 'B3',
    score: 76,
    status: 'Available',
    gridInfo: {
      currentPower: 40,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Complete electrical service upgrade required for Level 2 or DC chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 52000,
    upgradeDuration: 65,
    recommendedOption: 'Level 1 chargers only',
    savingsEstimate: 52000,
    timeSavings: 65
  },
  {
    id: '41',
    address: '305 Liberty St',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Commercial',
    size: 9500,
    zoning: 'D1',
    score: 91,
    status: 'Available',
    gridInfo: {
      currentPower: 110,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 14
    }
  },
  {
    id: '42',
    address: '301 E Liberty St',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Commercial',
    size: 7200,
    zoning: 'D1',
    score: 84,
    status: 'Available',
    gridInfo: {
      currentPower: 40,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Major electrical infrastructure upgrade required for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 56000,
    upgradeDuration: 70,
    recommendedOption: 'Level 2 chargers only (no grid upgrade)',
    savingsEstimate: 56000,
    timeSavings: 70
  },
  {
    id: '43',
    address: '320 S Division St',
    zipcode: '48104',
    city: 'Ann Arbor',
    type: 'Retail',
    size: 6100,
    zoning: 'D2',
    score: 78,
    status: 'Available',
    gridInfo: {
      currentPower: 30,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Transformer upgrade and new service panel required'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 3
    },
    upgradeCost: 35000,
    upgradeDuration: 45,
    recommendedOption: 'Level 1 chargers only',
    savingsEstimate: 35000,
    timeSavings: 45
  },
  {
    id: '44',
    address: '100 Monroe St NW',
    zipcode: '49503',
    city: 'Grand Rapids',
    type: 'Commercial',
    size: 13500,
    zoning: 'TN-CC',
    score: 89,
    status: 'Available',
    gridInfo: {
      currentPower: 120,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 15
    }
  },
  {
    id: '45',
    address: '158 Fulton St E',
    zipcode: '49503',
    city: 'Grand Rapids',
    type: 'Commercial',
    size: 8900,
    zoning: 'TN-CC',
    score: 82,
    status: 'Available',
    gridInfo: {
      currentPower: 45,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Full service upgrade needed for DC fast chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 7
    },
    upgradeCost: 49000,
    upgradeDuration: 60,
    recommendedOption: 'Level 2 chargers only',
    savingsEstimate: 49000,
    timeSavings: 60
  },
  {
    id: '46',
    address: '625 Westshire Dr NE',
    zipcode: '49505',
    city: 'Grand Rapids',
    type: 'Industrial',
    size: 22000,
    zoning: 'TN-TBA',
    score: 85,
    status: 'Available',
    gridInfo: {
      currentPower: 140,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 16
    }
  },
  {
    id: '47',
    address: '2121 Celebration Dr NE',
    zipcode: '49505',
    city: 'Grand Rapids',
    type: 'Commercial',
    size: 9500,
    zoning: 'TN-TBA',
    score: 78,
    status: 'Available',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Full electrical infrastructure upgrade required'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 45000,
    upgradeDuration: 55,
    recommendedOption: 'Level 1 chargers only',
    savingsEstimate: 45000,
    timeSavings: 55
  },
  {
    id: '48',
    address: '117 W Allegan St',
    zipcode: '48933',
    city: 'Lansing',
    type: 'Commercial',
    size: 11200,
    zoning: 'G1',
    score: 86,
    status: 'Available',
    gridInfo: {
      currentPower: 95,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 10
    }
  },
  {
    id: '49',
    address: '112 S Washington Sq',
    zipcode: '48933',
    city: 'Lansing',
    type: 'Commercial',
    size: 8300,
    zoning: 'G1',
    score: 79,
    status: 'Available',
    gridInfo: {
      currentPower: 40,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Major electrical service upgrade needed for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 6
    },
    upgradeCost: 51000,
    upgradeDuration: 63,
    recommendedOption: 'Level 2 chargers only',
    savingsEstimate: 51000,
    timeSavings: 63
  },
  {
    id: '50',
    address: '300 S Washington Ave',
    zipcode: '48607',
    city: 'Saginaw',
    type: 'Commercial',
    size: 13000,
    zoning: 'C-3',
    score: 84,
    status: 'Available',
    gridInfo: {
      currentPower: 85,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 9
    }
  },
  {
    id: '51',
    address: '515 N Washington Ave',
    zipcode: '48607',
    city: 'Saginaw',
    type: 'Commercial',
    size: 7100,
    zoning: 'C-2',
    score: 77,
    status: 'Available',
    gridInfo: {
      currentPower: 30,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Multiple utility upgrades required for Level 2 chargers'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 5
    },
    upgradeCost: 43000,
    upgradeDuration: 52,
    recommendedOption: 'Level 1 chargers only',
    savingsEstimate: 43000,
    timeSavings: 52
  },
  {
    id: '52',
    address: '120 E Front St',
    zipcode: '49684',
    city: 'Traverse City',
    type: 'Commercial',
    size: 10800,
    zoning: 'C-2',
    score: 90,
    status: 'Available',
    gridInfo: {
      currentPower: 90,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 10
    }
  },
  {
    id: '53',
    address: '235 E State St',
    zipcode: '49684',
    city: 'Traverse City',
    type: 'Retail',
    size: 6500,
    zoning: 'C-2',
    score: 79,
    status: 'Available',
    gridInfo: {
      currentPower: 35,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Complete electrical upgrade required for DC fast charging'
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 47000,
    upgradeDuration: 58,
    recommendedOption: 'Level 2 chargers only',
    savingsEstimate: 47000,
    timeSavings: 58
  },
  {
    id: '54',
    address: '430 S Saginaw St',
    zipcode: '48502',
    city: 'Flint',
    type: 'Commercial',
    size: 12500,
    zoning: 'D-3',
    score: 83,
    status: 'Available',
    gridInfo: {
      currentPower: 80,
      currentVoltage: 480,
      needsUpgrade: false
    },
    evChargerSupport: {
      level1: true,
      level2: true,
      dcFast: true,
      maxChargers: 8
    }
  },
  {
    id: '55',
    address: '615 S Saginaw St',
    zipcode: '48502',
    city: 'Flint',
    type: 'Commercial',
    size: 7400,
    zoning: 'D-3',
    score: 75,
    status: 'Available',
    gridInfo: {
      currentPower: 30,
      currentVoltage: 240,
      needsUpgrade: true,
      upgradeDetails: 'Major service panel and transformer upgrades needed'
    },
    evChargerSupport: {
      level1: true,
      level2: false,
      dcFast: false,
      maxChargers: 4
    },
    upgradeCost: 41000,
    upgradeDuration: 50,
    recommendedOption: 'Level 1 chargers only',
    savingsEstimate: 41000,
    timeSavings: 50
  }
];

const PropertyDatabase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [zoning, setZoning] = useState('');
  const [status, setStatus] = useState('');
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 50000]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([70, 100]);
  const [evChargerFilter, setEvChargerFilter] = useState('');
  const [gridUpgradeFilter, setGridUpgradeFilter] = useState('');
  const [properties] = useState<PropertyDetail[]>(sampleProperties);
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetail | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPermitOpen, onOpen: onPermitOpen, onClose: onPermitClose } = useDisclosure();
  const { isOpen: isComparisonOpen, onOpen: onComparisonOpen, onClose: onComparisonClose } = useDisclosure();
  const [permitProposal, setPermitProposal] = useState<PermitProposal | null>(null);
  const [comparisonResult, setComparisonResult] = useState<SiteComparisonResult | null>(null);
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  const [chargerType, setChargerType] = useState<'level1' | 'level2' | 'dcFast'>('level2');
  
  // Refs for PDF generation
  const permitProposalRef = useRef<HTMLDivElement>(null);
  const comparisonReportRef = useRef<HTMLDivElement>(null);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.zipcode.includes(searchTerm) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !propertyType || property.type === propertyType;
    const matchesZoning = !zoning || property.zoning === zoning;
    const matchesStatus = !status || property.status === status;
    const matchesSize = property.size >= sizeRange[0] && property.size <= sizeRange[1];
    const matchesScore = property.score >= scoreRange[0] && property.score <= scoreRange[1];
    
    // Filter based on EV charger support
    const matchesEvCharger = !evChargerFilter || 
      (evChargerFilter === 'level1' && property.evChargerSupport.level1) ||
      (evChargerFilter === 'level2' && property.evChargerSupport.level2) ||
      (evChargerFilter === 'dcFast' && property.evChargerSupport.dcFast);
    
    // Filter based on grid upgrade requirements
    const matchesGridUpgrade = gridUpgradeFilter === '' || 
      (gridUpgradeFilter === 'yes' && property.gridInfo.needsUpgrade) ||
      (gridUpgradeFilter === 'no' && !property.gridInfo.needsUpgrade);
    
    return matchesSearch && matchesType && matchesZoning && matchesStatus && 
           matchesSize && matchesScore && matchesEvCharger && matchesGridUpgrade;
  });

  const uniqueZonings = Array.from(new Set(properties.map(property => property.zoning)));
  const uniqueStatuses = Array.from(new Set(properties.map(property => property.status)));

  const handleViewDetails = (property: PropertyDetail) => {
    setSelectedProperty(property);
    onOpen();
  };

  // Function to generate permit proposal
  const generatePermitProposal = (property: PropertyDetail) => {
    const needsDCFast = property.evChargerSupport.dcFast;
    const needsLevel2 = property.evChargerSupport.level2;
    const isCommercial = property.type === 'Commercial' || property.type === 'Industrial' || property.type === 'Retail';
    
    // Generate proposal based on property characteristics
    const proposal: PermitProposal = {
      propertyId: property.id,
      permitType: isCommercial ? 'Commercial EV Charging Station Permit' : 'Residential EV Charging Station Permit',
      requiredDocuments: [
        'Completed Electrical Permit Application',
        'Site Plan showing proposed EV charger locations',
        'Electrical Load Calculations',
        'Manufacturer\'s Installation Instructions',
        'Equipment Specifications',
      ],
      estimatedFees: isCommercial 
        ? (needsDCFast ? 750 : 350) 
        : (needsLevel2 ? 250 : 150),
      estimatedTimeline: isCommercial 
        ? (needsDCFast ? 30 : 15) 
        : 10,
      localRequirements: [],
      inspectionRequirements: [
        'Initial Inspection before installation',
        'Final Inspection after installation',
      ],
      notes: ''
    };

    // Add commercial-specific requirements
    if (isCommercial) {
      proposal.requiredDocuments.push('ADA Compliance Documentation');
      proposal.requiredDocuments.push('Electrical Engineer Stamped Plans');
      proposal.localRequirements.push('Local Zoning Approval');
      proposal.localRequirements.push('Utility Notification');
      
      if (needsDCFast) {
        proposal.localRequirements.push('Utility Capacity Verification');
        proposal.localRequirements.push('Environmental Review (if applicable)');
        proposal.inspectionRequirements.push('Utility Interconnection Inspection');
      }
    }

    // Add location-specific requirements based on city
    if (property.city === 'Detroit') {
      proposal.localRequirements.push('Detroit Electrical Code Compliance');
      proposal.localRequirements.push('Detroit Building Safety Inspection');
      proposal.notes = 'Detroit requires an additional electrical service inspection for all commercial EV installations.';
    } else if (property.city === 'Ann Arbor') {
      proposal.localRequirements.push('Ann Arbor Sustainability Office Review');
      proposal.notes = 'Ann Arbor offers expedited permitting for EV installations that meet green building standards.';
    } else if (property.city === 'Grand Rapids') {
      proposal.localRequirements.push('Grand Rapids Development Center Approval');
      proposal.notes = 'Grand Rapids requires projects to be submitted through the Development Center Portal.';
    }

    // Add grid-specific requirements
    if (property.gridInfo.needsUpgrade) {
      proposal.requiredDocuments.push('Electrical Service Upgrade Plans');
      proposal.requiredDocuments.push('Utility Coordination Documentation');
      proposal.estimatedTimeline += 20; // Add time for grid upgrades
      proposal.notes += ' This property requires electrical service upgrades, adding complexity and time to the permitting process.';
    }

    setPermitProposal(proposal);
    onPermitOpen();
  };

  // Export filtered properties to CSV
  const handleExport = () => {
    // Define CSV headers
    const headers = ['ID', 'Address', 'Zipcode', 'City', 'Type', 'Size', 'Zoning', 'Score', 'Status', 
                     'Current Power (kW)', 'Current Voltage (V)', 'Needs Upgrade', 'Level 1 Support', 
                     'Level 2 Support', 'DC Fast Support', 'Max Chargers'];
    // Map filtered properties to rows
    const rows = filteredProperties.map(({ 
      id, address, zipcode, city, type, size, zoning, score, status, 
      gridInfo, evChargerSupport 
    }) => [
      id,
      address,
      zipcode,
      city,
      type,
      size.toString(),
      zoning,
      score.toString(),
      status,
      gridInfo.currentPower.toString(),
      gridInfo.currentVoltage.toString(),
      gridInfo.needsUpgrade ? 'Yes' : 'No',
      evChargerSupport.level1 ? 'Yes' : 'No',
      evChargerSupport.level2 ? 'Yes' : 'No',
      evChargerSupport.dcFast ? 'Yes' : 'No',
      evChargerSupport.maxChargers.toString()
    ]);
    // Combine headers and rows, wrapping each cell in quotes to handle commas
    const csvContent = [headers, ...rows]
      .map(row => row
        .map(cell => `"${cell.replace(/"/g, '""')}"`)
        .join(','))
        .join('\n');
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'properties.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // New function to find best locations in selected zipcodes
  const findBestLocations = () => {
    const zipCodesMap: {[key: string]: {best: PropertyDetail | null, alternatives: PropertyDetail[]}} = {};
    let totalCostSavings = 0;
    let totalTimeSavings = 0;
    
    // Get unique zipcodes from properties
    const uniqueZipCodes = Array.from(new Set(properties.map(p => p.zipcode)));
    
    // If no specific zipcodes selected, use all
    const zipCodesToAnalyze = selectedZipCodes.length > 0 ? selectedZipCodes : uniqueZipCodes;
    
    const bestLocations: PropertyDetail[] = [];
    const alternativeLocations: PropertyDetail[] = [];
    
    // Analyze each zipcode
    zipCodesToAnalyze.forEach(zipcode => {
      // Get properties in this zipcode that support the selected charger type
      const propertiesInZip = properties.filter(
        p => p.zipcode === zipcode && 
        (chargerType === 'level1' ? p.evChargerSupport.level1 : 
         chargerType === 'level2' ? p.evChargerSupport.level2 : 
         p.evChargerSupport.dcFast)
      );
      
      if (propertiesInZip.length === 0) {
        zipCodesMap[zipcode] = {
          best: null,
          alternatives: []
        };
        return;
      }
      
      // Sort by grid readiness, then by power capacity (higher is better)
      const sortedProperties = [...propertiesInZip].sort((a, b) => {
        if (a.gridInfo.needsUpgrade === b.gridInfo.needsUpgrade) {
          return b.gridInfo.currentPower - a.gridInfo.currentPower; // Higher power is better
        }
        return a.gridInfo.needsUpgrade ? 1 : -1; // Ready grid is better
      });
      
      const best = sortedProperties[0];
      bestLocations.push(best);
      
      // Alternative locations are those that need upgrades
      const alternatives = sortedProperties.filter(p => 
        p.id !== best.id && p.gridInfo.needsUpgrade
      );
      
      alternativeLocations.push(...alternatives);
      
      zipCodesMap[zipcode] = {
        best,
        alternatives
      };
      
      // Calculate savings for this zipcode
      for (const alt of alternatives) {
        if (alt.upgradeCost && alt.upgradeDuration && !best.gridInfo.needsUpgrade) {
          totalCostSavings += alt.upgradeCost;
          totalTimeSavings += alt.upgradeDuration;
        }
      }
    });
    
    setComparisonResult({
      bestLocations,
      alternativeLocations,
      totalCostSavings,
      totalTimeSavings,
      zipCodes: zipCodesMap
    });
    
    onComparisonOpen();
  };

  // PDF generation function
  const generatePDF = (contentRef: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!contentRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download the PDF');
      return;
    }
    
    // Create a styled document with the content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1000px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4 {
              color: #2C5282;
              margin-bottom: 10px;
            }
            .section {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #E2E8F0;
              border-radius: 8px;
            }
            .grid-ready { color: #38A169; }
            .upgrade-needed { color: #DD6B20; }
            .cost-savings { color: #38A169; font-weight: bold; }
            .time-savings { color: #3182CE; font-weight: bold; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th, td {
              border: 1px solid #E2E8F0;
              padding: 8px;
              text-align: left;
            }
            th { background-color: #F7FAFC; }
            ul { padding-left: 20px; }
            @media print {
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `);
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }, 1000);
  };

  // Function to export comparison report as PDF
  const exportComparisonReport = () => {
    if (comparisonReportRef.current && comparisonResult) {
      generatePDF(comparisonReportRef, 'ev-charger-site-analysis.pdf');
    }
  };
  
  // Function to export permit proposal as PDF
  const exportPermitProposal = () => {
    if (permitProposalRef.current && permitProposal) {
      generatePDF(permitProposalRef, 'ev-charger-permit-proposal.pdf');
    }
  };

  return (
    <Box>
      <Heading mb={6}>Property Database</Heading>

      <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={6}>
        <VStack spacing={4}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
            <GridItem colSpan={12}>
              <Input
                placeholder="Search by address, zipcode, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Type</Text>
              <Select
                placeholder="All Types"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Retail">Retail</option>
                <option value="Parking">Parking Lot</option>
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Zoning</Text>
              <Select
                placeholder="All Zonings"
                value={zoning}
                onChange={(e) => setZoning(e.target.value)}
              >
                {uniqueZonings.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Status</Text>
              <Select
                placeholder="All Statuses"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {uniqueStatuses.map(stat => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Button colorScheme="brand" mt={6} width="100%" onClick={handleExport}>
                Export CSV
              </Button>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">EV Charger Support</Text>
              <Select
                placeholder="All Types"
                value={evChargerFilter}
                onChange={(e) => setEvChargerFilter(e.target.value)}
              >
                <option value="level1">Level 1 Compatible</option>
                <option value="level2">Level 2 Compatible</option>
                <option value="dcFast">DC Fast Compatible</option>
              </Select>
            </GridItem>
            
            <GridItem colSpan={3}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Grid Upgrade Required</Text>
              <Select
                placeholder="All"
                value={gridUpgradeFilter}
                onChange={(e) => setGridUpgradeFilter(e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </GridItem>
            
            <GridItem colSpan={6}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Size Range (sq ft)</Text>
              <Flex>
                <NumberInput 
                  min={0} 
                  max={50000} 
                  value={sizeRange[0]} 
                  onChange={(val) => setSizeRange([parseInt(val), sizeRange[1]])}
                  mr={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <RangeSlider
                  aria-label={['min', 'max']}
                  min={0}
                  max={50000}
                  step={1000}
                  value={sizeRange}
                  onChange={(val) => setSizeRange(val as [number, number])}
                  flex={1}
                  mx={2}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <NumberInput 
                  min={0} 
                  max={50000} 
                  value={sizeRange[1]} 
                  onChange={(val) => setSizeRange([sizeRange[0], parseInt(val)])}
                  ml={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </GridItem>
            
            <GridItem colSpan={6}>
              <Text mb={1} fontSize="sm" fontWeight="medium">Score Range</Text>
              <Flex>
                <NumberInput 
                  min={70} 
                  max={100} 
                  value={scoreRange[0]} 
                  onChange={(val) => setScoreRange([parseInt(val), scoreRange[1]])}
                  mr={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <RangeSlider
                  aria-label={['min', 'max']}
                  min={70}
                  max={100}
                  step={1}
                  value={scoreRange}
                  onChange={(val) => setScoreRange(val as [number, number])}
                  flex={1}
                  mx={2}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <NumberInput 
                  min={70} 
                  max={100} 
                  value={scoreRange[1]} 
                  onChange={(val) => setScoreRange([scoreRange[0], parseInt(val)])}
                  ml={2}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
            </GridItem>
          </Grid>
        </VStack>
      </Box>

      {/* Add Site Comparison section */}
      <Box width="100%">
        <Divider my={4} />
        <Heading size="md" mb={3}>Site Comparison</Heading>
        <Text mb={3}>Compare locations to find ideal EV charger placement with minimal grid upgrades.</Text>
        
        <Grid templateColumns="repeat(12, 1fr)" gap={4} width="100%">
          <GridItem colSpan={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">Select ZipCodes (Optional)</Text>
            <Select 
              placeholder="All ZipCodes"
              value={selectedZipCodes.length > 0 ? selectedZipCodes[0] : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  setSelectedZipCodes([value]);
                } else {
                  setSelectedZipCodes([]);
                }
              }}
            >
              <option value="">All ZipCodes</option>
              {Array.from(new Set(properties.map(p => p.zipcode))).map(zip => (
                <option key={zip} value={zip}>{zip}</option>
              ))}
            </Select>
          </GridItem>
          
          <GridItem colSpan={4}>
            <Text mb={1} fontSize="sm" fontWeight="medium">Charger Type</Text>
            <Select 
              value={chargerType}
              onChange={(e) => setChargerType(e.target.value as 'level1' | 'level2' | 'dcFast')}
            >
              <option value="level1">Level 1 (120V)</option>
              <option value="level2">Level 2 (240V)</option>
              <option value="dcFast">DC Fast Charging</option>
            </Select>
          </GridItem>
          
          <GridItem colSpan={4}>
            <Button 
              leftIcon={<FiMap />} 
              colorScheme="blue" 
              mt={6} 
              width="100%" 
              onClick={findBestLocations}
            >
              Find Optimal Locations
            </Button>
          </GridItem>
        </Grid>
      </Box>

      <Box bg="white" borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Zipcode</Th>
              <Th>Type</Th>
              <Th isNumeric>Size (sq ft)</Th>
              <Th>Zoning</Th>
              <Th>EV Charger</Th>
              <Th>Grid Status</Th>
              <Th isNumeric>Score</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProperties.map((property) => (
              <Tr key={property.id}>
                <Td>{property.address}</Td>
                <Td>{property.zipcode}</Td>
                <Td>{property.type}</Td>
                <Td isNumeric>{property.size.toLocaleString()}</Td>
                <Td>{property.zoning}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Tooltip label="Level 1 (120V)">
                      <Badge colorScheme={property.evChargerSupport.level1 ? 'green' : 'gray'}>L1</Badge>
                    </Tooltip>
                    <Tooltip label="Level 2 (240V)">
                      <Badge colorScheme={property.evChargerSupport.level2 ? 'blue' : 'gray'}>L2</Badge>
                    </Tooltip>
                    <Tooltip label="DC Fast Charging">
                      <Badge colorScheme={property.evChargerSupport.dcFast ? 'purple' : 'gray'}>DC</Badge>
                    </Tooltip>
                  </HStack>
                </Td>
                <Td>
                  <Tooltip label={property.gridInfo.needsUpgrade ? property.gridInfo.upgradeDetails : 'Grid ready for EV chargers'}>
                    <Badge colorScheme={property.gridInfo.needsUpgrade ? 'yellow' : 'green'}>
                      {property.gridInfo.needsUpgrade ? 'Needs Upgrade' : 'Ready'}
                    </Badge>
                  </Tooltip>
                </Td>
                <Td isNumeric>
                  <Badge colorScheme={property.score >= 80 ? 'green' : 'yellow'}>
                    {property.score}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      property.status === 'Available'
                        ? 'green'
                        : property.status === 'Under Review'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {property.status}
                  </Badge>
                </Td>
                <Td>
                  <Button size="sm" colorScheme="brand" onClick={() => handleViewDetails(property)}>
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Property Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProperty?.address}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProperty && (
              <>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <GridItem>
                    <Stat>
                      <StatLabel>Address</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.address}</StatNumber>
                      <StatHelpText>{selectedProperty.city}, MI {selectedProperty.zipcode}</StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel>Property Type</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.type}</StatNumber>
                      <StatHelpText>Zoning: {selectedProperty.zoning}</StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel>Property Size</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.size.toLocaleString()} sq ft</StatNumber>
                      <StatHelpText>Score: {selectedProperty.score}/100</StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel>Status</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.status}</StatNumber>
                    </Stat>
                  </GridItem>
                </Grid>
                
                <Divider my={4} />
                
                <Heading size="md" mb={3}>Grid Information</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                  <GridItem>
                    <Stat>
                      <StatLabel>Current Power</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.gridInfo.currentPower} kW</StatNumber>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel>Current Voltage</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.gridInfo.currentVoltage} V</StatNumber>
                    </Stat>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Stat>
                      <StatLabel>Grid Status</StatLabel>
                      <Flex alignItems="center" mt={1}>
                        <Badge colorScheme={selectedProperty.gridInfo.needsUpgrade ? 'yellow' : 'green'} mr={2}>
                          {selectedProperty.gridInfo.needsUpgrade ? 'Needs Upgrade' : 'Ready for EV Chargers'}
                        </Badge>
                        {selectedProperty.gridInfo.needsUpgrade && (
                          <Text fontSize="sm" color="gray.600">{selectedProperty.gridInfo.upgradeDetails}</Text>
                        )}
                      </Flex>
                    </Stat>
                  </GridItem>
                </Grid>
                
                <Divider my={4} />
                
                <Heading size="md" mb={3}>EV Charger Compatibility</Heading>
                <SimpleGrid columns={4} spacing={4} mb={4}>
                  <Box>
                    <Stat>
                      <StatLabel>Level 1 (120V)</StatLabel>
                      <StatNumber fontSize="md">
                        <Badge colorScheme={selectedProperty.evChargerSupport.level1 ? 'green' : 'gray'} p={1}>
                          {selectedProperty.evChargerSupport.level1 ? 'Compatible' : 'Not Compatible'}
                        </Badge>
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box>
                    <Stat>
                      <StatLabel>Level 2 (240V)</StatLabel>
                      <StatNumber fontSize="md">
                        <Badge colorScheme={selectedProperty.evChargerSupport.level2 ? 'blue' : 'gray'} p={1}>
                          {selectedProperty.evChargerSupport.level2 ? 'Compatible' : 'Not Compatible'}
                        </Badge>
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box>
                    <Stat>
                      <StatLabel>DC Fast Charging</StatLabel>
                      <StatNumber fontSize="md">
                        <Badge colorScheme={selectedProperty.evChargerSupport.dcFast ? 'purple' : 'gray'} p={1}>
                          {selectedProperty.evChargerSupport.dcFast ? 'Compatible' : 'Not Compatible'}
                        </Badge>
                      </StatNumber>
                    </Stat>
                  </Box>
                  <Box>
                    <Stat>
                      <StatLabel>Max Chargers</StatLabel>
                      <StatNumber fontSize="md">{selectedProperty.evChargerSupport.maxChargers}</StatNumber>
                    </Stat>
                  </Box>
                </SimpleGrid>
                
                {selectedProperty.gridInfo.needsUpgrade && (
                  <>
                    <Divider my={4} />
                    
                    <Heading size="md" mb={3}>Upgrade Analysis</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
                      <GridItem>
                        <Stat>
                          <StatLabel>Estimated Upgrade Cost</StatLabel>
                          <StatNumber fontSize="md">${selectedProperty.upgradeCost?.toLocaleString()}</StatNumber>
                          <StatHelpText>For grid capacity increase</StatHelpText>
                        </Stat>
                      </GridItem>
                      <GridItem>
                        <Stat>
                          <StatLabel>Estimated Upgrade Time</StatLabel>
                          <StatNumber fontSize="md">{selectedProperty.upgradeDuration} days</StatNumber>
                          <StatHelpText>Including permits and installation</StatHelpText>
                        </Stat>
                      </GridItem>
                    </Grid>
                    
                    <Box p={4} bg="gray.50" borderRadius="md" mb={4}>
                      <Heading size="sm" mb={2}>Recommendation</Heading>
                      <HStack>
                        <Icon as={FiCheckCircle} color="green.500" />
                        <Text>{selectedProperty.recommendedOption}</Text>
                      </HStack>
                      <List spacing={2} mt={3}>
                        <ListItem>
                          <ListIcon as={FiDollarSign} color="green.500" />
                          <Text as="span" fontWeight="medium">Cost savings: </Text> 
                          ${selectedProperty.savingsEstimate?.toLocaleString()}
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FiClock} color="green.500" />
                          <Text as="span" fontWeight="medium">Time savings: </Text> 
                          {selectedProperty.timeSavings} days
                        </ListItem>
                      </List>
                    </Box>
                  </>
                )}
                
                <Divider my={4} />
                
                <Flex justifyContent="center" mt={4}>
                  <Button 
                    leftIcon={<FiFileText />} 
                    colorScheme="green" 
                    onClick={() => generatePermitProposal(selectedProperty)}
                  >
                    Generate Permit Proposal
                  </Button>
                </Flex>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Permit Proposal Modal */}
      <Modal isOpen={isPermitOpen} onClose={onPermitClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>EV Charger Permit Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {permitProposal && selectedProperty && (
              <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="md" ref={permitProposalRef}>
                <Heading size="md" mb={4}>
                  {permitProposal.permitType} - {selectedProperty.address}
                </Heading>
                <Text color="gray.600" mb={4}>
                  {selectedProperty.city}, MI {selectedProperty.zipcode}
                </Text>
                
                <SimpleGrid columns={2} spacing={6} mb={6}>
                  <Stat>
                    <StatLabel>Estimated Permit Fee</StatLabel>
                    <StatNumber>${permitProposal.estimatedFees.toLocaleString()}</StatNumber>
                    <StatHelpText>Based on local jurisdiction requirements</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Estimated Timeline</StatLabel>
                    <StatNumber>{permitProposal.estimatedTimeline} days</StatNumber>
                    <StatHelpText>From application to final approval</StatHelpText>
                  </Stat>
                </SimpleGrid>
                
                <Divider my={4} />
                
                <Heading size="sm" mb={3}>Required Documentation</Heading>
                <List spacing={2} mb={4}>
                  {permitProposal.requiredDocuments.map((doc, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiCheckCircle} color="green.500" />
                      {doc}
                    </ListItem>
                  ))}
                </List>
                
                <Heading size="sm" mb={3} mt={4}>Local Requirements</Heading>
                <List spacing={2} mb={4}>
                  {permitProposal.localRequirements.map((req, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiInfo} color="blue.500" />
                      {req}
                    </ListItem>
                  ))}
                </List>
                
                <Heading size="sm" mb={3} mt={4}>Inspection Requirements</Heading>
                <List spacing={2} mb={4}>
                  {permitProposal.inspectionRequirements.map((insp, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FiAlertTriangle} color="orange.500" />
                      {insp}
                    </ListItem>
                  ))}
                </List>
                
                {permitProposal.notes && (
                  <>
                    <Heading size="sm" mb={3} mt={4}>Important Notes</Heading>
                    <Text p={3} bg="yellow.50" borderRadius="md" mb={4}>
                      {permitProposal.notes}
                    </Text>
                  </>
                )}
                
                <Box bg="gray.50" p={4} borderRadius="md" mt={6}>
                  <Heading size="sm" mb={3}>Michigan EV Charger Installation Information</Heading>
                  <Text mb={3}>
                    In Michigan, EV charging installations are governed by the Michigan Electrical Code, based on the National Electrical Code (NEC) Article 625 for Electric Vehicle Charging Systems.
                  </Text>
                  <Text mb={3}>
                    Commercial installations must comply with the Americans with Disabilities Act (ADA) requirements and may be eligible for the Charge Up Michigan Program, which reimburses up to $70,000 for DC Fast Charger installations.
                  </Text>
                  <Text>
                    Residential installations may qualify for a $500 state rebate for Level 2 chargers, and utilities such as DTE Energy and Consumers Energy offer additional incentives.
                  </Text>
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FiDownload />} colorScheme="blue" mr={3} onClick={exportPermitProposal}>
              Download as PDF
            </Button>
            <Button colorScheme="brand" onClick={onPermitClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Site Comparison Results Modal */}
      <Modal isOpen={isComparisonOpen} onClose={onComparisonClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Optimal EV Charger Site Analysis</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {comparisonResult && (
              <Box ref={comparisonReportRef}>
                <Box bg="green.50" p={4} borderRadius="md" mb={6}>
                  <Heading size="md" mb={3}>Summary of Savings</Heading>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <Stat>
                        <StatLabel>Total Cost Savings</StatLabel>
                        <StatNumber color="green.600">${comparisonResult.totalCostSavings.toLocaleString()}</StatNumber>
                        <StatHelpText>By choosing locations with ready grid infrastructure</StatHelpText>
                      </Stat>
                    </GridItem>
                    <GridItem>
                      <Stat>
                        <StatLabel>Total Time Savings</StatLabel>
                        <StatNumber color="green.600">{comparisonResult.totalTimeSavings} days</StatNumber>
                        <StatHelpText>Faster deployment with no upgrades needed</StatHelpText>
                      </Stat>
                    </GridItem>
                  </Grid>
                </Box>
                
                <Heading size="md" mb={4}>Analysis by Zipcode</Heading>
                
                {Object.keys(comparisonResult.zipCodes).map(zipcode => {
                  const data = comparisonResult.zipCodes[zipcode];
                  return (
                    <Box 
                      key={zipcode} 
                      p={4} 
                      mb={6} 
                      border="1px solid" 
                      borderColor="gray.200" 
                      borderRadius="md"
                    >
                      <Heading size="md" mb={3}>
                        Zipcode: {zipcode}
                      </Heading>
                      
                      {data.best ? (
                        <>
                          <Heading size="sm" mb={2} color="green.600">
                            Recommended Location:
                          </Heading>
                          <Box p={3} bg="green.50" borderRadius="md" mb={4}>
                            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                              <GridItem colSpan={2}>
                                <Text fontWeight="bold">{data.best.address}</Text>
                                <Text>{data.best.city}, MI {data.best.zipcode}</Text>
                                <Text>{data.best.type} | {data.best.size.toLocaleString()} sq ft</Text>
                              </GridItem>
                              <GridItem>
                                <HStack>
                                  <FiCheckCircle color="green" />
                                  <Text>
                                    {data.best.gridInfo.needsUpgrade 
                                      ? 'Needs Upgrade' 
                                      : 'Grid Ready'}
                                  </Text>
                                </HStack>
                                <Text>Power: {data.best.gridInfo.currentPower} kW</Text>
                                <Text>Voltage: {data.best.gridInfo.currentVoltage}V</Text>
                              </GridItem>
                              <GridItem>
                                <HStack mt={1}>
                                  <Badge colorScheme={data.best.evChargerSupport.level1 ? 'green' : 'gray'} mr={1}>L1</Badge>
                                  <Badge colorScheme={data.best.evChargerSupport.level2 ? 'blue' : 'gray'} mr={1}>L2</Badge>
                                  <Badge colorScheme={data.best.evChargerSupport.dcFast ? 'purple' : 'gray'}>DC</Badge>
                                </HStack>
                                <Text mt={2}>Max Chargers: {data.best.evChargerSupport.maxChargers}</Text>
                              </GridItem>
                            </Grid>
                          </Box>
                          
                          {data.alternatives.length > 0 && (
                            <>
                              <Heading size="sm" mb={2} color="orange.600">
                                Alternative Locations:
                              </Heading>
                              <Box>
                                {data.alternatives.map((alt) => (
                                  <Box 
                                    key={alt.id} 
                                    p={3} 
                                    mb={2} 
                                    bg="orange.50" 
                                    borderRadius="md"
                                  >
                                    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                                      <GridItem colSpan={2}>
                                        <Text fontWeight="bold">{alt.address}</Text>
                                        <Text>{alt.city}, MI {alt.zipcode}</Text>
                                        <Text>{alt.type} | {alt.size.toLocaleString()} sq ft</Text>
                                      </GridItem>
                                      <GridItem>
                                        <HStack>
                                          <FiAlertTriangle color="orange" />
                                          <Text>Needs Upgrade</Text>
                                        </HStack>
                                        <Text color="gray.600" fontSize="sm">
                                          {alt.gridInfo.upgradeDetails}
                                        </Text>
                                      </GridItem>
                                      <GridItem>
                                        {data.best && !data.best.gridInfo.needsUpgrade && alt.upgradeCost && alt.upgradeDuration && (
                                          <>
                                            <HStack>
                                              <FiDollarSign color="red" />
                                              <Text>${alt.upgradeCost.toLocaleString()} extra cost</Text>
                                            </HStack>
                                            <HStack>
                                              <FiClock color="red" />
                                              <Text>{alt.upgradeDuration} days longer</Text>
                                            </HStack>
                                          </>
                                        )}
                                      </GridItem>
                                    </Grid>
                                  </Box>
                                ))}
                              </Box>
                            </>
                          )}
                        </>
                      ) : (
                        <Text>No compatible properties found in this zipcode for {chargerType === 'dcFast' ? 'DC Fast Charging' : chargerType === 'level2' ? 'Level 2 Charging' : 'Level 1 Charging'}.</Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FiRefreshCw />} colorScheme="blue" mr={3} onClick={findBestLocations}>
              Refresh Analysis
            </Button>
            <Button leftIcon={<FiDownload />} colorScheme="green" mr={3} onClick={exportComparisonReport}>
              Download as PDF
            </Button>
            <Button colorScheme="brand" onClick={onComparisonClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyDatabase; 