// src/pages/Menu.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  Badge,
  Heading,
  Stack,
  Image,
  Link,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import menuItemsData from "../data/menuItems.json";
import Logo from "/soul-good-logo.png";

// Promo images
const promos = [
  { src: "/promo1.jpg", title: "Healthy & Delicious", subtitle: "Salads, smoothies, proteins & low-carb snacks!" },
  { src: "/promo2.jpg", title: "Visit Our Cafe", subtitle: "57 E Capitol Dr, Kapitolyo, Pasig, Philippines" },
  { src: "/promo3.jpg", title: "Order Online", subtitle: "www.soulgoodph.com/delivery" },
];

export default function Menu() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activePromo, setActivePromo] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Auto-rotate promos every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Build category map dynamically
  const categories = useMemo(() => {
    const map = { All: menuItemsData.length };
    menuItemsData.forEach((item) => {
      const cat = item.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, []);

  // Filtered menu based on search & category
  const filtered = useMemo(() => {
    return menuItemsData.filter((item) => {
      const matchesCat = category === "All" || item.category === category;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  const cardBg = useColorModeValue("white", "gray.800");
  const nextPromo = () => setActivePromo((prev) => (prev + 1) % promos.length);

  // Simulate logout (redirect to login)
  const handleLogout = () => {
    onClose();
    window.location.href = "/login"; // redirect
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-b, orange.50, orange.100)">
      {/* Top bar with logo + logout */}
      <HStack
        justify="space-between"
        align="center"
        px={{ base: 4, md: 8 }}
        py={3}
        bg="white"
        boxShadow="sm"
      >
        <HStack spacing={3}>
          <Image src={Logo} alt="Soul Good Logo" boxSize="40px" />
          <Heading fontSize="lg" color="orange.600">
            Soul Good Cafe
          </Heading>
        </HStack>
        <Button colorScheme="orange" variant="outline" size="sm" onClick={onOpen}>
          Logout
        </Button>
      </HStack>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to log out?</ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="orange" ml={3} onClick={handleLogout}>
              Logout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Hero Section */}
      <Box
        mx={{ base: 4, md: 8 }}
        mt={4}
        borderRadius="xl"
        overflow="hidden"
        display={{ base: "block", md: "flex" }}
        boxShadow="md"
      >
        {/* Left Side: Static Details */}
        <Box
          flex="1"
          bgGradient="linear(to-b, orange.400, orange.500)"
          color="white"
          p={{ base: 6, md: 12 }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems={{ base: "center", md: "flex-start" }}
        >
          <Image src={Logo} alt="Soul Good Logo" boxSize="100px" mb={4} />
          <Heading fontSize={{ base: "2xl", md: "4xl" }} mb={2} textAlign={{ base: "center", md: "left" }}>
            Soul Good Cafe
          </Heading>
          <Text fontSize={{ base: "sm", md: "lg" }} mb={2} textAlign={{ base: "center", md: "left" }}>
            Healthy, tasty & bursting with flavors!
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} mb={4} textAlign={{ base: "center", md: "left" }}>
            📍 57 E Capitol Dr, Kapitolyo, Pasig, Philippines
          </Text>
          <HStack spacing={4} mb={4}>
            <Link href="https://instagram.com/soulgood.ph" isExternal>
              <FaInstagram size={28} />
            </Link>
            <Link href="https://facebook.com/soulgood" isExternal>
              <FaFacebook size={28} />
            </Link>
          </HStack>
          <Button
            as={Link}
            href="https://soulgoodph.com/delivery"
            isExternal
            colorScheme="whiteAlpha"
            size="md"
            bg="white"
            color="orange.600"
            _hover={{ bg: "orange.100" }}
          >
            Order Delivery
          </Button>
        </Box>

        {/* Right Side: Promo Image */}
        <Box
          flex="1"
          cursor="pointer"
          onClick={nextPromo}
          position="relative"
          minH={{ base: "200px", md: "300px" }}
        >
          <Image
            src={promos[activePromo].src}
            alt={promos[activePromo].title}
            objectFit="cover"
            w="100%"
            h="100%"
          />
          <Box position="absolute" top="0" left="0" w="100%" h="100%" bg="blackAlpha.200" />
        </Box>
      </Box>

      {/* ONLINE MENU Header */}
      <Box textAlign="center" mt={12} mb={6}>
        <Heading fontSize={{ base: "3xl", md: "5xl" }} color="orange.600">
          ONLINE MENU
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2}>
          Browse our delicious offerings below
        </Text>
      </Box>

      {/* Menu Section */}
      <Container maxW="container.lg" py={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* Search */}
          <Stack direction={{ base: "column", md: "row" }} align="center">
            <Box flex={1}>
              <Input
                placeholder="Search dishes, ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                bg="white"
                maxW="100%"
                borderRadius="md"
              />
            </Box>
          </Stack>

          {/* Categories */}
          <Box>
            {/* Desktop: Horizontal buttons */}
            <HStack spacing={3} wrap="wrap" display={{ base: "none", md: "flex" }}>
              {Object.entries(categories).map(([cat, count]) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={category === cat ? "solid" : "outline"}
                  colorScheme="orange"
                  onClick={() => setCategory(cat)}
                  borderRadius="full"
                  px={4}
                >
                  <HStack spacing={2}>
                    <Text>{cat}</Text>
                    <Badge bg="orange.100" color="orange.700" px={2} py={0}>
                      {count}
                    </Badge>
                  </HStack>
                </Button>
              ))}
            </HStack>

            {/* Mobile: Dropdown select */}
            <Box display={{ base: "block", md: "none" }} mt={2}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #E2E8F0",
                  fontSize: "1rem",
                }}
              >
                {Object.entries(categories).map(([cat, count]) => (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                ))}
              </select>
            </Box>
          </Box>

          {/* Menu Grid */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {filtered.map((item) => (
              <Box
                key={item.id}
                bg={cardBg}
                borderRadius="xl"
                boxShadow="sm"
                overflow="hidden"
                p={4}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  borderRadius="md"
                  mb={3}
                  objectFit="cover"
                  w="100%"
                  h="160px"
                  fallbackSrc="/default-food.jpg"
                />
                <Heading fontSize="lg" mb={1}>
                  {item.name}
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  {item.description}
                </Text>
                <Text fontWeight="bold" color="orange.600">
                  ₱{item.price}
                </Text>
              </Box>
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
