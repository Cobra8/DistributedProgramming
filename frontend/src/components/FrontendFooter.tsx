import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import NextImage from "next/image";
import React from "react";

interface FrontendFooterProps {}

export const FrontendFooter: React.FC<FrontendFooterProps> = ({}) => {
  return (
    <Box backgroundColor="#D4F1F4" marginTop={12}>
      <Flex marginX="auto" maxWidth="1200px" padding={4} justifyContent="space-between">
        <Box>
          <Heading size="lg" marginBottom={6}>
            Frontend
          </Heading>
          <Text>Concurrent and Distributed Programming</Text>
          <Text>University of Fribourg</Text>

          <Text marginTop={8}>Yannis Laaroussi & Lucas Bürgi</Text>
        </Box>

        <NextImage src="/react.svg" alt="logo" height="194px" width="194px" />
      </Flex>
    </Box>
  );
};
