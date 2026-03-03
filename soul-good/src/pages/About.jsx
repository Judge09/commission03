import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaInstagram, FaFacebook, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import Logo from "/soul-good-logo.png";

const hours = [
  { days: "Monday – Friday", time: "8:00 AM – 8:00 PM" },
  { days: "Saturday – Sunday", time: "9:00 AM – 7:00 PM" },
];

export default function About() {
  return (
    <Box minH="100vh" bg="orange.50">

      {/* Top navbar — matches Menu.jsx style */}
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
        <Button
          as={RouterLink}
          to="/menu"
          colorScheme="orange"
          variant="ghost"
          size="sm"
          flexShrink={0}
        >
          ← <Box as="span" display={{ base: "none", md: "inline" }}>Back to </Box>Menu
        </Button>
      </HStack>

      {/* Hero */}
      <Flex
        bgGradient="linear(to-br, orange.400, orange.600)"
        direction="column"
        align="center"
        justify="center"
        py={{ base: 14, md: 20 }}
        px={4}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bgImage={`url('${Logo}')`}
          bgRepeat="no-repeat"
          bgPos="center"
          bgSize="50%"
          opacity={0.06}
          pointerEvents="none"
        />
        <VStack spacing={4} position="relative" zIndex={1}>
          <Image src={Logo} alt="Soul Good Logo" boxSize={{ base: "90px", md: "120px" }} filter="drop-shadow(0 4px 16px rgba(0,0,0,0.2))" />
          <Heading
            fontSize={{ base: "3xl", md: "5xl" }}
            color="white"
            fontFamily="var(--font-recoleta)"
            textShadow="0 2px 12px rgba(0,0,0,0.2)"
          >
            About Us
          </Heading>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            color="whiteAlpha.900"
            maxW="480px"
            fontFamily="var(--font-lora)"
            lineHeight="1.7"
          >
            Healthy, tasty &amp; bursting with flavors
          </Text>
        </VStack>
      </Flex>

      <Container maxW="container.md" px={{ base: 3, md: 6 }} py={{ base: 8, md: 16 }}>
        <VStack spacing={8} align="stretch">

          {/* Our Story */}
          <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 4, md: 10 }}>
            <HStack mb={4} align="center" spacing={3}>
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                color="orange.600"
                fontFamily="var(--font-recoleta)"
              >
                Our Story
              </Heading>
              <Badge colorScheme="orange" borderRadius="full" px={3} py={1} fontSize="xs">
                Est. 2024
              </Badge>
            </HStack>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.700"
              lineHeight="1.9"
              fontFamily="var(--font-lora)"
            >
              Soul Good Cafe started with a simple idea — that healthy food should never be boring.
              We craft every dish with fresh, wholesome ingredients to fuel your body and delight
              your taste buds. From energizing smoothies to hearty meals, everything on our menu
              is made with love and purpose.
            </Text>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.700"
              lineHeight="1.9"
              fontFamily="var(--font-lora)"
              mt={4}
            >
              We believe that eating well is an act of self-care. That's why we source the freshest
              local ingredients and put mindfulness into every recipe — so you can feel as good as
              the food tastes.
            </Text>
          </Box>

          {/* Location & Hours */}
          <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 4, md: 10 }}>
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              color="orange.600"
              fontFamily="var(--font-recoleta)"
              mb={6}
            >
              Find Us
            </Heading>
            <Stack direction={{ base: "column", md: "row" }} spacing={8} align="flex-start">

              {/* Address */}
              <VStack align="flex-start" spacing={3} flex={1}>
                <HStack spacing={2} color="orange.500">
                  <Icon as={FaMapMarkerAlt} boxSize={5} />
                  <Text fontWeight="600" fontSize="md" fontFamily="var(--font-lora)">Location</Text>
                </HStack>
                <Text fontSize="sm" color="gray.700" fontFamily="var(--font-lora)" lineHeight="1.8">
                  57 E Capitol Dr<br />
                  Kapitolyo, Pasig<br />
                  Philippines
                </Text>
                <Link
                  href="https://maps.google.com/?q=57+E+Capitol+Dr+Kapitolyo+Pasig+Philippines"
                  isExternal
                  color="orange.500"
                  fontSize="sm"
                  fontWeight="500"
                  _hover={{ textDecoration: "underline" }}
                >
                  Open in Google Maps →
                </Link>

                {/* Map placeholder */}
                <Box
                  w="100%"
                  h="140px"
                  bg="orange.50"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="orange.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                  mt={1}
                >
                  <iframe
                    title="Soul Good Cafe Map"
                    width="100%"
                    height="140"
                    style={{ border: 0 }}
                    loading="lazy"
                    src="https://www.google.com/maps?q=57+E+Capitol+Dr,+Kapitolyo,+Pasig,+Philippines&output=embed"
                  />
                </Box>
              </VStack>

              {/* Hours */}
              <VStack align="flex-start" spacing={3} flex={1}>
                <HStack spacing={2} color="orange.500">
                  <Icon as={FaClock} boxSize={5} />
                  <Text fontWeight="600" fontSize="md" fontFamily="var(--font-lora)">Hours</Text>
                </HStack>
                <VStack align="stretch" spacing={2} w="100%">
                  {hours.map(({ days, time }) => (
                    <Box key={days}>
                      <Text fontSize="sm" color="gray.600" fontFamily="var(--font-lora)">{days}</Text>
                      <Text fontSize="sm" fontWeight="600" color="gray.800" fontFamily="var(--font-lora)">{time}</Text>
                    </Box>
                  ))}
                </VStack>
              </VStack>
            </Stack>
          </Box>

          {/* Social Media */}
          <Box bg="white" borderRadius="xl" boxShadow="md" p={{ base: 4, md: 10 }} textAlign="center">
            <Heading
              fontSize={{ base: "xl", md: "2xl" }}
              color="orange.600"
              fontFamily="var(--font-recoleta)"
              mb={2}
            >
              Follow Us
            </Heading>
            <Text fontSize="sm" color="gray.500" fontFamily="var(--font-lora)" mb={6}>
              Stay updated with our latest dishes, promos, and cafe news.
            </Text>
            <HStack justify="center" spacing={6}>
              <Link href="https://instagram.com/soulgood.ph" isExternal _hover={{ textDecoration: "none" }}>
                <VStack spacing={2}>
                  <Flex
                    w="60px" h="60px"
                    borderRadius="xl"
                    bgGradient="linear(to-br, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
                    align="center"
                    justify="center"
                    boxShadow="md"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaInstagram} boxSize={7} color="white" />
                  </Flex>
                  <Text fontSize="xs" color="gray.600" fontWeight="500">Instagram</Text>
                </VStack>
              </Link>

              <Link href="https://web.facebook.com/profile.php?id=61562474990748" isExternal _hover={{ textDecoration: "none" }}>
                <VStack spacing={2}>
                  <Flex
                    w="60px" h="60px"
                    borderRadius="xl"
                    bg="#1877f2"
                    align="center"
                    justify="center"
                    boxShadow="md"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    <Icon as={FaFacebook} boxSize={7} color="white" />
                  </Flex>
                  <Text fontSize="xs" color="gray.600" fontWeight="500">Facebook</Text>
                </VStack>
              </Link>
            </HStack>
          </Box>

          {/* Back to Menu */}
          <Flex justify="center" pb={4}>
            <Button
              as={RouterLink}
              to="/menu"
              colorScheme="orange"
              size="lg"
              borderRadius="full"
              px={10}
              fontFamily="var(--font-lora)"
            >
              Back to Menu
            </Button>
          </Flex>

        </VStack>
      </Container>
    </Box>
  );
}
