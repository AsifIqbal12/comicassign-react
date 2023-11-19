<VStack spacing={4} mt={8}>
            {generatedImages.some((img) => img !== null) && (
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={4} width="100%">
                {generatedImages.map((imageUrl, index) => (
                  <Box key={index} bg="white" boxShadow="md" p={4} borderRadius="md" position="relative">
                    {imageUrl !== null && (
                      <img src={imageUrl} alt={`Generated Comic Panel ${index + 1}`} maxW="100%" borderRadius="md" />
                    )}
                    <Box mt={2} width="100%" textAlign="center">
                      <Button onClick={() => handleAddSpeechBubble(index)} mt={2}>
                        Add Speech Bubble
                      </Button>
                      {selectedPanelIndex === index && (
                        <Box mt={2}>
                          <Input
                            placeholder="Enter speech bubble text"
                            value={speechBubbleText}
                            onChange={(e) => setSpeechBubbleText(e.target.value)}
                          />
                          <Button onClick={handleSpeechBubbleSubmit} mt={2}>
                            Submit
                          </Button>
                        </Box>
                      )}
                      {generatedImages[index].speechBubbleText && (
                        <SpeechBubble text={generatedImages[index].speechBubbleText} marginTop={2} />
                      )}
                    </Box>
                  </Box>
                ))}
              </Grid>
            )}
          </VStack>