import { Box, Heading } from "@chakra-ui/layout";
import { FrontendProps } from "./Frontend";

export const FrontendWrapper: React.FC<FrontendProps> = ({ siteTitle = "", variant = "wide", children }) => {
  const variants = { small: 400, regular: 800, wide: 1200, full: "" };

  return (
    <Box paddingX={5} marginTop={8} marginX="auto" maxWidth={variants[variant]} width="100%" minHeight="500px">
      <Box>
        <Heading textAlign="center" fontSize="x-large" marginBottom={5}>
          {siteTitle}
        </Heading>
      </Box>
      {children}
    </Box>
  );
};

export default FrontendWrapper;
