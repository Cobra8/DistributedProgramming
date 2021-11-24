import { Box } from "@chakra-ui/layout";
import { Frontend } from "../components/Frontend";

const Index = () => {
  return (
    <Frontend siteTitle="Overview" variant="wide">
      <Box>Welcome to the frontend page of our project for the concurrent and distributed programming course</Box>
    </Frontend>
  );
};

export default Index;
