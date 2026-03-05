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
  Image,
  Link,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
  Select,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { GiKnifeFork, GiCoffeeCup, GiFrenchFries, GiHotMeal } from "react-icons/gi";
import { useMenuItems } from "../hooks/useMenuItems";
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
  const navigate = useNavigate();
  const toast = useToast();
  const { user: authUser, logout: authLogout } = useAuth();
  const {
    isFavorite,
    toggleFavorite,
    addToCart,
    updateQuantity,
    getCartItem,
    cartItemCount,
    getItemQuantity,
  } = useCart();

  const { menuItems, loading: menuLoading } = useMenuItems();

  // Auto-rotate promos
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Only show available items
  const availableItems = useMemo(
    () => menuItems.filter((item) => item.is_available !== false),
    [menuItems]
  );

  // Categories map
  const categories = useMemo(() => {
    const map = { All: availableItems.length };
    availableItems.forEach((item) => {
      const cat = item.category || "Uncategorized";
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }, [availableItems]);

  // Filter items
  const filtered = useMemo(() => {
    return availableItems.filter((item) => {
      const matchesCat = category === "All" || item.category === category;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [query, category, availableItems]);

  const nextPromo = () => setActivePromo((prev) => (prev + 1) % promos.length);

  const user = authUser;

  const handleToggleFavorite = (item) => {
    if (!user) return alert("Please log in to save favorites.");
    toggleFavorite(item);
  };

  const handleAdd = async (item) => {
    if (!user) return alert("Please log in to add to cart.");
    try {
      await addToCart(item, 1);
      toast({
        title: "Added to cart",
        description: item.name,
        status: "success",
        duration: 1800,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to add", status: "error", duration: 2000, position: "bottom" });
    }
  };

  const handleRemove = async (item) => {
    const cartItem = getCartItem(item.id || item.item_id);
    if (!cartItem) return;
    try {
      if (cartItem.quantity <= 1) {
        await updateQuantity(cartItem.id, 0);
      } else {
        await updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update cart", status: "error", duration: 2000, position: "bottom" });
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      onClose();
      navigate("/welcome", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to logout. Please try again.");
    }
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
    <Box minH="100vh" position="relative" bg="orange.50">
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
            <Heading fontSize="lg" color="orange.600" fontFamily="var(--font-recoleta)">
              Soul Good Cafe
            </Heading>
          </HStack>
          <HStack spacing={{ base: 1, md: 3 }}>
            <Button
              as={RouterLink}
              to="/about"
              colorScheme="orange"
              variant="ghost"
              size="sm"
              px={{ base: 2, md: 3 }}
            >
              About
            </Button>
            <Button
              as={RouterLink}
              to="/cart"
              colorScheme="orange"
              variant="ghost"
              size="sm"
              position="relative"
              px={{ base: 2, md: 3 }}
            >
              <Box display={{ base: "none", md: "inline" }}>View </Box>Cart
              {cartItemCount > 0 && (
                <Badge
                  position="absolute"
                  top="-5px"
                  right="-5px"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="0.7em"
                  px={2}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              colorScheme="orange"
              variant="outline"
              size="sm"
              onClick={onOpen}
              px={{ base: 2, md: 3 }}
            >
              <Box display={{ base: "none", md: "inline" }}>Log</Box>out
            </Button>
          </HStack>
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
              fontFamily="var(--font-recoleta)"
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
              <Link href="https://web.facebook.com/profile.php?id=61562474990748" isExternal>
                <FaFacebook size={28} />
              </Link>
            </HStack>
            {/* Order Delivery removed as part of cleanup */}
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
          <Heading fontSize={{ base: "3xl", md: "5xl" }} color="orange.600" fontFamily="var(--font-allrounder)">
            ONLINE MENU
          </Heading>
          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mt={2}>
            Browse our delicious offerings below
          </Text>
        </Box>

        {/* Menu section */}
        <Container maxW="container.lg" px={{ base: 3, md: 6 }} py={{ base: 4, md: 8 }}>
          <VStack spacing={6} align="stretch">
            {/* Categories + Search inline (responsive) - STICKY HEADER */}
            <HStack
              align="center"
              spacing={3}
              position="sticky"
              top={{ base: "-1px", md: 0 }}
              bg="orange.50"
              zIndex={100}
              py={3}
              px={{ base: 3, md: 0 }}
              mx={{ base: -3, md: 0 }}
              boxShadow="sm"
              backdropFilter="blur(10px)"
              borderBottom="1px solid"
              borderColor="orange.200"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: "orange.50",
                opacity: 0.95,
                zIndex: -1,
              }}
            >
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                bg="white"
                size="md"
                aria-label="Filter by category"
                fontFamily="var(--font-lora)"
                flexShrink={0}
                w={{ base: "140px", md: "220px" }}
              >
                {Object.entries(categories).map(([cat, count]) => (
                  <option key={cat} value={cat}>
                    {`${cat} (${count})`}
                  </option>
                ))}
              </Select>

              <Input
                placeholder="Search dishes, ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                bg="white"
                borderRadius="md"
                fontFamily="var(--font-lora)"
                flex={1}
              />
            </HStack>



            {/* Menu grid */}
            {menuLoading ? (
              <Center py={12}><Spinner size="xl" color="orange.400" /></Center>
            ) : (
              <Box
                display="grid"
                gridTemplateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ base: 3, md: 6 }}
              >
                {filtered.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    imgFallback="/default-food.jpg"
                    isFavorite={isFavorite(item.id)}
                    quantity={getItemQuantity(item.id)}
                    onToggleFavorite={() => handleToggleFavorite(item)}
                    onAdd={() => handleAdd(item)}
                    onRemove={() => handleRemove(item)}
                  />
                ))}
              </Box>
            )}
          </VStack>
        </Container>

        {/* Discreet admin access — small dot bottom-right */}
        <Box
          as={RouterLink}
          to="/admin"
          position="fixed"
          bottom={3}
          right={3}
          w="8px"
          h="8px"
          borderRadius="full"
          bg="gray.300"
          opacity={0.3}
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.3s"
          zIndex={999}
          title=""
        />
      </Box>
    </Box>
  );
}
