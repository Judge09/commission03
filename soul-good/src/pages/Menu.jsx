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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
} from "@chakra-ui/react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { GiKnifeFork, GiCoffeeCup, GiFrenchFries, GiHotMeal } from "react-icons/gi";
import menuItemsData from "../data/menuItems.json";
import Logo from "/soul-good-logo.png";
import MenuItemCard from "../components/MenuItemCard";

// Promo images
const promos = [
  {
    src: "/promo1.png",
    title: "Healthy & Delicious",
    subtitle: "Salads, smoothies, proteins & low-carb snacks!",
  },
  {
    src: "/promo2.png",
    title: "Visit Our Cafe",
    subtitle: "57 E Capitol Dr, Kapitolyo, Pasig, Philippines",
  },
  {
    src: "/promo3.png",
    title: "Order Online",
    subtitle: "www.soulgoodph.com/delivery",
  },
];

export default function Menu() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activePromo, setActivePromo] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Auto-rotate promos
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Categories map
  const categories = useMemo(() => {
    const map = { All: menuItemsData.length };
    menuItemsData.forEach((item) => {
      const cat = item.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, []);

  // Filter items
  const filtered = useMemo(() => {
    return menuItemsData.filter((item) => {
      const matchesCat = category === "All" || item.category === category;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  const nextPromo = () => setActivePromo((prev) => (prev + 1) % promos.length);

  const handleLogout = () => {
    onClose();
    window.location.href = "/welcome";
  };

// Background floating icons
const bgIcons = [GiKnifeFork, GiCoffeeCup, GiFrenchFries, GiHotMeal];

const randomIcons = useMemo(() => {
  return Array.from({ length: 35 }).map((_, i) => { // more icons
    const IconComp = bgIcons[i % bgIcons.length];
    return {
      id: i,
      IconComp,
      top: Math.random() * 100, // 0% - 100% height
      left: Math.random() * 100, // 0% - 100% width
      size: 40 + Math.random() * 80,
      animationDelay: Math.random() * 5,
      opacity: 0.05 + Math.random() * 0.1,
    };
  });
}, []);


  return (
    <Box minH="100vh" position="relative" overflow="hidden" bg="orange.50">
      {/* Background icons */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        pointerEvents="none"
      >
        {randomIcons.map(
          ({ id, IconComp, top, left, size, animationDelay, opacity }) => (
            <Box
              key={id}
              position="absolute"
              top={`${top}%`}
              left={`${left}%`}
              opacity={opacity}
              animation={`float 8s ease-in-out infinite`}
              animationDelay={`${animationDelay}s`}
              sx={{
                "@keyframes float": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: `translateY(-${20 + Math.random() * 20}px)` },
                },
              }}
            >
              <Icon as={IconComp} boxSize={`${size}px`} color="green.400" />
            </Box>
          )
        )}
      </Box>

      {/* Foreground */}
      <Box position="relative" zIndex={1}>
        {/* Top bar */}
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
          <Button
            colorScheme="orange"
            variant="outline"
            size="sm"
            onClick={onOpen}
          >
            Logout
          </Button>
        </HStack>

        {/* Logout Modal */}
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

        {/* Hero section */}
        <Box
          mx={{ base: 4, md: 8 }}
          mt={4}
          borderRadius="xl"
          overflow="hidden"
          display={{ base: "block", md: "flex" }}
          boxShadow="md"
        >
          {/* Left side */}
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
            <Heading
              fontSize={{ base: "2xl", md: "4xl" }}
              mb={2}
              textAlign={{ base: "center", md: "left" }}
            >
              Soul Good Cafe
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "lg" }}
              mb={2}
              textAlign={{ base: "center", md: "left" }}
            >
              Healthy, tasty & bursting with flavors!
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              mb={4}
              textAlign={{ base: "center", md: "left" }}
            >
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

          {/* Right side (promo carousel) */}
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
            <Box
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bg="blackAlpha.200"
            />
          </Box>
        </Box>

        {/* Online Menu heading */}
        <Box textAlign="center" mt={12} mb={6}>
          <Heading fontSize={{ base: "3xl", md: "5xl" }} color="orange.600">
            ONLINE MENU
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2}>
            Browse our delicious offerings below
          </Text>
        </Box>

        {/* Menu section */}
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
                  borderRadius="md"
                />
              </Box>
            </Stack>

            {/* Categories */}
            <Box>
              {/* Desktop */}
              <HStack
                spacing={3}
                wrap="wrap"
                display={{ base: "none", md: "flex" }}
              >
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
                      <Badge bg="orange.100" color="orange.700" px={2}>
                        {count}
                      </Badge>
                    </HStack>
                  </Button>
                ))}
              </HStack>

              {/* Mobile */}
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

            {/* Menu grid */}
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {filtered.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  imgFallback="/default-food.jpg"
                />
              ))}
            </Box>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
