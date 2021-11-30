import { Box, Heading } from "@chakra-ui/layout";
import { FrontendProps } from "./Frontend";

export const FrontendWrapper: React.FC<FrontendProps> = ({ siteTitle = "", variant = "wide", children }) => {
  const variants = { small: 400, regular: 800, wide: 1200, full: "" };

  return (
    <Box paddingX={5} marginTop={8} marginX="auto" maxWidth={variants[variant]} width="100%" minHeight="500px">
      <Box>
        <Heading as="h2" size="lg" textAlign="center" marginBottom={5}>
          {siteTitle}
        </Heading>
      </Box>
      {children}
    </Box>
  );
};

export default FrontendWrapper;
