import React, { useState } from 'react';
import {Text,useToast,Textarea,Checkbox,Flex, Box,Heading, Input, Button, VStack, Icon } from '@chakra-ui/react';
import axios,{ CancelToken } from 'axios';
import { DownloadIcon } from '@chakra-ui/icons';
import { MdCreate } from 'react-icons/md';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';

function ComicGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [panelTexts, setPanelTexts] = useState([{ mainText: '', annotation: '' }]);
  const [generatedImages, setGeneratedImages] = useState(Array(panelTexts.length).fill(null));
  const [selectedPanels, setSelectedPanels] = useState(Array(panelTexts.length).fill(true));
  const [isInputFormActive, setIsInputFormActive] = useState(false); 
  const [panelCount, setPanelCount] = useState(1);
  const toast = useToast();
  let cancelTokenSource = axios.CancelToken.source();
  const generateImage = async (textData, index) => {
    try {
      setIsLoading(true);
      const apiUrl = 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud';
      const apiKey = 'VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM'; // Replace with your actual API key
        console.log('java');
        // console.log(process.env.API_KEY);
      const response = await axios.post(
        apiUrl,
        { inputs: textData.mainText },
        {
          headers: {
            'Accept': 'image/png',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
          cancelToken: cancelTokenSource.token,
        }
      );

      const imageUrl = URL.createObjectURL(new Blob([response.data]));
      setGeneratedImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index] = imageUrl;
        return updatedImages;
      });
    } catch (error) {
      if (axios.isCancel(error)) {
      // Request was canceled
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error generating image:', error.message);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to generate image. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const generateImages = async () => {
    try {

      setIsLoading(true);
      cancelTokenSource.cancel('Request canceled');
      cancelTokenSource = axios.CancelToken.source();
      await Promise.all(
        panelTexts.map((textData, index) => {
          if (selectedPanels[index]) {
            return generateImage(textData, index);
          }
          return null;
        })
      );
      setIsLoading(false);
      toast({
        title: 'Success',
        description: 'Panels generated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating images:', error.message);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to generate images. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    cancelTokenSource.cancel('Request canceled by user');
    setIsLoading(false);
  };

  const handleMainTextChange = (index, value) => {
    const updatedPanels = [...panelTexts];
    updatedPanels[index] = { ...updatedPanels[index], mainText: value };
    setPanelTexts(updatedPanels);
  };

  const handleAnnotationChange = (index, value) => {
    const updatedPanels = [...panelTexts];
    updatedPanels[index] = { ...updatedPanels[index], annotation: value };
    setPanelTexts(updatedPanels);
  };

  const handleAddPanel = () => {
    if (panelCount < 10) {
      setPanelTexts((prevPanels) => [...prevPanels, { mainText: '', annotation: '' }]);
      setSelectedPanels((prevSelection) => [...prevSelection, true]);
      setPanelCount((prevCount) => prevCount + 1);
    }
  };

  const handleRemovePanel = (index) => {
    setPanelTexts((prevPanels) => {
      const updatedPanels = [...prevPanels];
      updatedPanels.splice(index, 1);
      return updatedPanels;
    });

    setGeneratedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });

    setSelectedPanels((prevSelection) => {
      const updatedSelection = [...prevSelection];
      updatedSelection.splice(index, 1);
      return updatedSelection;
    });

    setPanelCount((prevCount) => prevCount - 1);

  };

  const handleGenerateClick = (e) => {
    e.preventDefault();
    generateImages();
  };

  const handleSelectPanel = (index) => {
    setSelectedPanels((prevSelection) => {
      const updatedSelection = [...prevSelection];
      updatedSelection[index] = !updatedSelection[index];
      return updatedSelection;
    });
  };

  const handleStartNewComic = () => {
    setPanelTexts([{ mainText: '', annotation: '' }]);
    setGeneratedImages([null]);
    setSelectedPanels([true]);
    setIsInputFormActive(false); 
  };



// const waitForImages = (images) => {
//   const promises = images.map((imageUrl) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = 'anonymous';
//       img.onload = resolve;
//       img.onerror = reject;
//       img.src = imageUrl;
//     });
//   });

//   return Promise.all(promises);
// };



const handleSaveComic = () => {
  const nonNullImages = generatedImages.filter((imageUrl) => imageUrl !== null);

  if (nonNullImages.length === 0) {
    console.warn('No images to save.');
    return;
  }

  const pdf = new jsPDF();

  nonNullImages.forEach((imageUrl, index) => {
    const imgData = imageUrl; 
    pdf.addImage(imgData, 'JPEG', 10, 10, 190, 150); 
    pdf.text(`${panelTexts[index].mainText}`, 10, 170); 
    pdf.addPage(); 
  });

  // Save the PDF
  pdf.save('comic.pdf');
};





  const handleActivateInputForm = () => {
    setIsInputFormActive(true);
  };

  return (
      <Box p={4} 
      maxW={{ base: '100%', sm: '1000px', md: '1000px', lg: '1000px', xl: '1000px' }} 
      mx="auto" width="100%" backgroundColor="#f0f0f0"
      backgroundSize="cover"
        backgroundPosition="center">
      <Heading as="h1" size="xl" mb={6}>
          Comic Generator
      </Heading>
      {isInputFormActive ? (
        <form onSubmit={handleGenerateClick}>
        <Flex flexWrap="wrap" justifyContent="space-between">
          {panelTexts.map((textData, index) => (
            <Box
                key={index}
                bg="white"
                boxShadow="md"
                p={4}
                borderRadius="md"
                m={4}
                width={['100%', '45%', '45%']} // Full width on mobile, 50% on tablet, 50% on desktop
                boxSizing="border-box"
                marginRight={index === panelTexts.length - 1 && panelTexts.length % 2 !== 0 ? 'auto' : null}
                marginLeft={index === panelTexts.length - 1 && panelTexts.length % 2 !== 0 ? 'auto' : null}
                
            >
              <Heading size="md" mb={4}>
                Panel {index + 1} of 10
              </Heading>
              <Textarea
                placeholder="Enter main text for this panel..."
                value={textData.mainText}
                onChange={(e) => handleMainTextChange(index, e.target.value)}
                mb={2}
                // style={{ width: '70%', aspectRatio: '3/2' }}
              />
              {/* <Textarea
                placeholder="Enter annotation text for this panel..."
                value={textData.annotation}
                onChange={(e) => handleAnnotationChange(index, e.target.value)}
                mb={2}
                // style={{ width: '70%', aspectRatio: '3/2' }}
              /> */}
              {panelTexts.length > 1 && (
                <Flex alignItems="center" justify="center">
                  <Checkbox
                    isChecked={selectedPanels[index]}
                    onChange={() => handleSelectPanel(index)}
                    mr={2}
                  >
                    Generate Image
                  </Checkbox>
                  {/* <Spacer mx={0.1} /> */}
                  <Button colorScheme="red" size="sm" onClick={() => handleRemovePanel(index)}>
                    Remove Panel
                  </Button>
                </Flex>
              )}
            </Box>
          ))}
          </Flex>
          {panelCount < 10 && (
            <Button
              colorScheme="teal"
              size="lg"
              mt={4}
              mr={2}
              onClick={handleAddPanel}
              leftIcon={<Icon as={MdCreate} />}
            >
              Add New Panel
            </Button>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            mt={4} mr={2} 
            isLoading={isLoading}
            loadingText="Generating..."
          >
            Generate Selected Panels
          </Button>
        
          {panelTexts.length > 1 &&!isLoading&& (
          <Button
            colorScheme="purple"
            size="lg"
            mt={4}
            onClick={handleStartNewComic}
          >
            Start New Comic
          </Button>
          )}
          {panelTexts.length > 0 &&isLoading&& (
          <Button
            colorScheme="red"
            size="lg"
            mt={4}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          )}
          
        </form>
        ) : (
          <Button colorScheme="blue" size="lg" mt={4} onClick={handleActivateInputForm} leftIcon={<MdCreate />}>
            Start Your Comic Journey
          </Button>
        )}
        {generatedImages.some((img) => img !== null) && (
          <VStack spacing={4} mt={8}>
            {generatedImages.map((imageUrl, index) => (
              <Box
                key={index}
                bg="white"
                boxShadow="md"
                p={4}
                borderRadius="md"
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="relative"
                marginBottom={4}  
              >
                {imageUrl !== null && (
                  <img
                    src={imageUrl}
                    alt={`Generated Comic Panel ${index + 1}`}
                    maxW="100%"
                    borderRadius="md"
                  />
                )}
                <Box
                  mt={2}
                  color="black"
                  fontSize="sm"
                  textAlign="center"
                  width="100%"
                >
                  <Text mt={2}>{panelTexts[index].mainText}</Text>
                  <Text mt={2}>{panelTexts[index].annotation}</Text>
                </Box>
              </Box>
            ))}
          </VStack>
        )}

        {generatedImages.some((img) => img !== null) && (
          <Button colorScheme="green" size="md" mt={4} onClick={handleSaveComic}>
            <DownloadIcon mr={2}/>Download Comic
          </Button>
        )}
      </Box>
  );
}

export default ComicGenerator;