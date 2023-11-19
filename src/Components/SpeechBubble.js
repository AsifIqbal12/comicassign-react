import { Box, useMediaQuery } from '@chakra-ui/react';

// Assuming you have a default max width for larger screens
const defaultMaxPanelWidth = 300;

const SpeechBubble = ({ text, marginTop }) => {
  const maxPanelWidth = useMediaQuery('(max-width: 400px)') ? 600 : defaultMaxPanelWidth;

  const contentWidth = Math.min(text.length * 8, 0.3 * maxPanelWidth);

  return (
    <Box
      position="relative"
      backgroundColor="white"
      padding={4}
      borderRadius="8px"
      boxShadow="md"
      marginTop={marginTop}
      width={`${contentWidth}px`}
      _after={{
        content: '""',
        position: 'absolute',
        top: '50%',
        right: '100%',
        marginTop: '-15px',
        borderWidth: '15px',
        borderStyle: 'solid',
        borderColor: 'transparent white transparent transparent',
      }}
    >
      {text}
    </Box>
  );
};


export default SpeechBubble;