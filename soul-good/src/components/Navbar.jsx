// src/components/Navbar.jsx
import React from "react";
import {
  Flex,
  Box,
  Text,
  IconButton,
  Spacer,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Navbar() {
  const bg = useColorModeValue("whiteAlpha.900", "gray.800");

  return (
    <Flex
      as="header"
      align="center"
      px={{ base: 4, md: 6 }}
      py={3}
      bg={bg}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={20}
    >
      {/* Logo */}
      <Box display="flex" alignItems="center" gap={3}>
        <Box
          w="40px"
          h="40px"
          rounded="full"
          bgGradient="linear(to-br, orange.400, orange.500)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          fontSize="lg"
        >
          🍽
        </Box>
        <Text
          fontWeight="bold"
          color="orange.600"
          fontSize={{ base: "lg", md: "xl" }}
        >
          Soul Good
        </Text>
      </Box>

      <Spacer />

      {/* Hamburger menu */}
      <IconButton
        aria-label="menu"
        icon={<HamburgerIcon />}
        variant="ghost"
        rounded="md"
        _hover={{ bg: useColorModeValue("orange.100", "orange.700") }}
      />
    </Flex>
  );
}
