import { Box, Flex, Heading, Link } from "@chakra-ui/layout";
import NextImage from "next/image";
import NextLink from "next/link";
import React from "react";

interface FrontendHeaderProps {}

export const FrontendHeader: React.FC<FrontendHeaderProps> = ({}) => {
  const menuItem = (name: string, path: string, first: boolean = false) => {
    return (
      <NextLink href={path} passHref>
        <Link
          key={name}
          padding={4}
          paddingRight={first ? 0 : 4}
          marginX={4}
          marginRight={first ? 0 : 4}
          color="black"
          _focus={{ boxShadow: "none" }}
          _hover={{ color: "#75E6DA" }}
          __css={{ transition: "all 0.3s ease" }}
        >
          {name}
        </Link>
      </NextLink>
    );
  };

  return (
    <Box position="sticky" top={0} zIndex={1} backgroundColor="white">
      <Flex marginX="auto" maxWidth="1200px" justifyContent="space-between" paddingY={4}>
        <NextLink href="/">
          <Heading cursor="pointer" fontWeight="bold" lineHeight="63px">
            Frontend
          </Heading>
        </NextLink>

        <NextImage src="/react.png" alt="logo" height="75px" width="75px" />
      </Flex>

      <Box backgroundColor="#D4F1F4" paddingY={1}>
        <Flex marginX="auto" maxWidth="1200px" justifyContent="right">
          {menuItem("Home", "/")}
          {menuItem("Ping", "/ping")}
          {menuItem("Users", "/users")}
        </Flex>
      </Box>
    </Box>
  );
};
