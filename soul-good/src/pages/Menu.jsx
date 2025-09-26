// src/pages/Menu.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  SimpleGrid,
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
  Icon,
} from "@chakra-ui/react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import Navbar from "../components/Navbar";
import MenuItemCard from "../components/MenuItemCard";
import menuItemsData from "../data/menuItems.json";

export default function Menu() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const map = { All: menuItemsData.length };
    menuItemsData.forEach((m) => {
      map[m.category] = (map[m.category] || 0) + 1;
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    return menuItemsData.filter((m) => {
      const matchesCat = category === "All" || m.category === category;
      const matchesQuery =
        !query ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.description.toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bgGradient="linear(to-b, orange.50, orange.100)">
      <Navbar logo="/soul-good-logo.png" />

      {/* Hero Section */}
      <Container maxW="container.lg" py={{ base: 6, md: 12 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={8}
          align="center"
          bgGradient="linear(to-r, orange.400, orange.500)"
          borderRadius="xl"
          p={{ base: 6, md: 12 }}
          color="white"
        >
          <Image
            src="/promo-hero.jpg"
            alt="Promo"
            borderRadius="xl"
            objectFit="cover"
            maxH={{ base: "200px", md: "300px" }}
            flex={{ md: "1" }}
            w="100%"
          />

          <VStack
            spacing={4}
            align={{ base: "center", md: "start" }}
            flex={{ md: "1" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Heading fontSize={{ base: "2xl", md: "3xl" }}>
              🚀 Healthy & Tasty Meals
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }}>
              Salads, smoothies, proteins & low carb snacks, bursting with
              flavors!
            </Text>

            <HStack spacing={4}>
              <Link
                href="https://instagram.com/soulgood.ph"
                isExternal
                _hover={{ color: "orange.200" }}
              >
                <Icon as={FaInstagram} w={6} h={6} />
              </Link>
              <Link
                href="https://facebook.com/soulgood.ph"
                isExternal
                _hover={{ color: "orange.200" }}
              >
                <Icon as={FaFacebook} w={6} h={6} />
              </Link>
            </HStack>

            <Text mt={2}>
              🛵{" "}
              <Link
                href="https://www.soulgoodph.com/delivery"
                isExternal
                textDecoration="underline"
              >
                www.soulgoodph.com/delivery
              </Link>
            </Text>

            <Text fontWeight="semibold">Page · Cafe</Text>
            <Text>📍 57 E Capitol Dr, Kapitolyo, Pasig, Philippines</Text>
          </VStack>
        </Stack>
      </Container>

      {/* Menu Section */}
      <Container maxW="container.lg" py={{ base: 4, md: 8 }}>
        <VStack spacing={6} align="stretch">
          {/* Header + Search */}
          <Stack direction={{ base: "column", md: "row" }} align="center">
            <Heading as="h2" size="lg" color="orange.600">
              Soul Good Menu
            </Heading>
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
          <HStack spacing={3} wrap="wrap">
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

          {/* Menu Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                cardBg={cardBg}
                imgFallback="/default-food.jpg"
              />
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
