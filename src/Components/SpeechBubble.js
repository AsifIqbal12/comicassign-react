import { Box, useMediaQuery } from '@chakra-ui/react';

// Assuming you have a default max width for larger screens
const defaultMaxPanelWidth = 150;

const SpeechBubble = ({ text, marginTop }) => {
  const maxPanelWidth = useMediaQuery('(max-width: 400px)') ? 200 : defaultMaxPanelWidth;

  const contentWidth = Math.min(text.length * 25, 0.8 * maxPanelWidth);
//   const contentWidth = 0.5 * maxPanelWidth;
  return (
    <Box
    //   position="relative"
      backgroundColor="white"
      padding={2}
      borderRadius="8px"
      boxShadow="md"
    //   marginTop={marginTop}
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