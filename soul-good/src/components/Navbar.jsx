// src/components/Navbar.jsx
import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Image,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar({ logo }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="white" px={4} shadow="md" position="sticky" top="0" zIndex="100">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Link href="/">
          <Image src={logo} alt="Soul Good Logo" boxSize="50px" objectFit="contain" />
        </Link>

        {/* Desktop nav links */}
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} fontWeight="medium" color="gray.700">
              {link.name}
            </Link>
          ))}
        </HStack>

        {/* Hamburger for mobile */}
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={onOpen}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Image src={logo} alt="Soul Good Logo" boxSize="50px" objectFit="contain" />
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  as={Link}
                  href={link.href}
                  variant="ghost"
                  w="full"
                  justifyContent="flex-start"
                  onClick={onClose}
                >
                  {link.name}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
