import React, { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Checkbox,
  Text,
  useToast,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react';
import { MdCheckCircle, MdDescription } from 'react-icons/md';

interface DocumentForm {
  siteName: string;
  siteAddress: string;
  propertyType: string;
  documentType: string;
  additionalNotes: string;
  includeFloorPlan: boolean;
  includeUtilityPlan: boolean;
  includePermitForms: boolean;
}

const DocumentGenerator: React.FC = () => {
  const toast = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState<DocumentForm>({
    siteName: '',
    siteAddress: '',
    propertyType: '',
    documentType: '',
    additionalNotes: '',
    includeFloorPlan: true,
    includeUtilityPlan: true,
    includePermitForms: true,
  });

  const handleInputChange = (
    field: keyof DocumentForm,
    value: string | boolean
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    toast({
      title: 'Documents Generated',
      description: 'Your documents have been generated successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <Heading mb={6}>Document Generator</Heading>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Site Name</FormLabel>
              <Input
                value={form.siteName}
                onChange={e => handleInputChange('siteName', e.target.value)}
                placeholder="Enter site name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Site Address</FormLabel>
              <Input
                value={form.siteAddress}
                onChange={e => handleInputChange('siteAddress', e.target.value)}
                placeholder="Enter site address"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Property Type</FormLabel>
              <Select
                value={form.propertyType}
                onChange={e => handleInputChange('propertyType', e.target.value)}
                placeholder="Select property type"
              >
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="retail">Retail</option>
                <option value="parking">Parking Lot</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Document Type</FormLabel>
              <Select
                value={form.documentType}
                onChange={e => handleInputChange('documentType', e.target.value)}
                placeholder="Select document type"
              >
                <option value="site-plan">Site Plan</option>
                <option value="permit-application">Permit Application</option>
                <option value="lease-agreement">Lease Agreement</option>
                <option value="full-package">Full Document Package</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Additional Notes</FormLabel>
              <Textarea
                value={form.additionalNotes}
                onChange={e => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Enter any additional notes or requirements"
                rows={4}
              />
            </FormControl>

            <Box>
              <Text fontWeight="medium" mb={2}>Include Additional Documents:</Text>
              <VStack align="start" spacing={2}>
                <Checkbox
                  isChecked={form.includeFloorPlan}
                  onChange={e => handleInputChange('includeFloorPlan', e.target.checked)}
                >
                  Floor Plan
                </Checkbox>
                <Checkbox
                  isChecked={form.includeUtilityPlan}
                  onChange={e => handleInputChange('includeUtilityPlan', e.target.checked)}
                >
                  Utility Plan
                </Checkbox>
                <Checkbox
                  isChecked={form.includePermitForms}
                  onChange={e => handleInputChange('includePermitForms', e.target.checked)}
                >
                  Permit Forms
                </Checkbox>
              </VStack>
            </Box>

            <Button
              colorScheme="brand"
              size="lg"
              onClick={handleGenerate}
              isLoading={isGenerating}
              loadingText="Generating Documents"
            >
              Generate Documents
            </Button>
          </VStack>
        </Box>

        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="md" mb={4}>Generated Documents</Heading>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={MdDescription} color="brand.500" />
                  Site Plan.pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={MdDescription} color="brand.500" />
                  Electrical Layout.pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={MdDescription} color="brand.500" />
                  Permit Application.pdf
                </ListItem>
                <ListItem>
                  <ListIcon as={MdDescription} color="brand.500" />
                  Cost Estimates.xlsx
                </ListItem>
              </List>
            </Box>

            <Box>
              <Heading size="md" mb={4}>Document Checklist</Heading>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Property Information Complete
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Site Plans Generated
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Permits Prepared
                </ListItem>
                <ListItem>
                  <ListIcon as={MdCheckCircle} color="green.500" />
                  Cost Estimates Calculated
                </ListItem>
              </List>
            </Box>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
};

export default DocumentGenerator; 