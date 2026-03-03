import { Box, Button, Flex, Text, Image, VStack, HStack, Grid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { GiKnifeFork } from "react-icons/gi";
import { FiShoppingCart, FiSmile } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const slides = [
  { id: 0 },
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);

  const skipToLast = () => {
    if (swiperRef.current) swiperRef.current.slideTo(3);
  };

  return (
    <Box
      minH="100vh"
      w="100%"
      overflow="hidden"
      position="relative"
      sx={{
        ".swiper": { width: "100%", height: "100vh" },
        ".swiper-slide": { width: "100%", height: "100vh" },
        /* Dot pagination */
        ".swiper-pagination": {
          bottom: "32px !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          zIndex: 20,
        },
        ".swiper-pagination-bullet": {
          width: "8px",
          height: "8px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.5)",
          opacity: 1,
          margin: "0 !important",
          transition: "all 0.3s ease",
        },
        ".swiper-pagination-bullet-active": {
          width: "28px",
          background: "white",
        },
      }}
    >
      {/* Skip button — hidden on last slide */}
      {activeSlide < 3 && (
        <Box
          position="fixed"
          top={5}
          right={6}
          zIndex={50}
          onClick={skipToLast}
          cursor="pointer"
        >
          <Text
            color="white"
            fontSize="15px"
            fontWeight="500"
            opacity={0.85}
            _hover={{ opacity: 1 }}
            fontFamily="var(--font-allrounder)"
            textShadow="0 1px 4px rgba(0,0,0,0.4)"
          >
            Skip
          </Text>
        </Box>
      )}

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4500, disableOnInteraction: true }}
        speed={650}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
      >
        {/* ── SLIDE 1: Brand Intro ── */}
        <SwiperSlide>
          <Flex
            h="100vh"
            w="100%"
            bgGradient="linear(to-br, orange.400, orange.600)"
            direction="column"
            justify="center"
            align="center"
            position="relative"
            overflow="hidden"
          >
            {/* Subtle background watermark */}
            <Box
              position="absolute"
              inset={0}
              bgImage="url('/soul-good-logo.png')"
              bgRepeat="no-repeat"
              bgPos="center"
              bgSize="60%"
              opacity={0.06}
              pointerEvents="none"
            />
            <AnimatePresence mode="wait">
              {activeSlide === 0 && (
                <MotionVStack
                  key="slide1"
                  spacing={6}
                  align="center"
                  px={8}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/soul-good-logo.png"
                    alt="Soul Good Logo"
                    w={{ base: "160px", md: "200px" }}
                    filter="drop-shadow(0 4px 24px rgba(0,0,0,0.25))"
                  />
                  <Text
                    fontSize={{ base: "36px", md: "48px" }}
                    fontWeight="700"
                    color="white"
                    textAlign="center"
                    lineHeight="1.1"
                    fontFamily="var(--font-recoleta)"
                    textShadow="0 2px 12px rgba(0,0,0,0.2)"
                  >
                    Soul Good Cafe
                  </Text>
                  <Text
                    fontSize={{ base: "16px", md: "20px" }}
                    color="whiteAlpha.900"
                    textAlign="center"
                    maxW="320px"
                    lineHeight="1.6"
                    fontFamily="var(--font-lora)"
                  >
                    Healthy, tasty & bursting with flavors
                  </Text>
                </MotionVStack>
              )}
            </AnimatePresence>
          </Flex>
        </SwiperSlide>

        {/* ── SLIDE 2: Menu Highlights ── */}
        <SwiperSlide>
          <Flex
            h="100vh"
            w="100%"
            bg="#111"
            direction="column"
            justify="center"
            align="center"
            position="relative"
            overflow="hidden"
          >
            {/* 2x2 food photo grid as background */}
            <Grid
              position="absolute"
              inset={0}
              templateColumns="1fr 1fr"
              templateRows="1fr 1fr"
              gap={0}
            >
              {["/1.png", "/5.png", "/11.png", "/20.png"].map((src, i) => (
                <Box key={i} overflow="hidden">
                  <Image
                    src={src}
                    alt=""
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    opacity={0.55}
                  />
                </Box>
              ))}
            </Grid>

            {/* Dark overlay */}
            <Box position="absolute" inset={0} bg="blackAlpha.600" />

            <AnimatePresence mode="wait">
              {activeSlide === 1 && (
                <MotionVStack
                  key="slide2"
                  spacing={4}
                  align="center"
                  px={8}
                  position="relative"
                  zIndex={2}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Text
                    fontSize={{ base: "34px", md: "46px" }}
                    fontWeight="700"
                    color="white"
                    textAlign="center"
                    lineHeight="1.1"
                    fontFamily="var(--font-recoleta)"
                    textShadow="0 2px 16px rgba(0,0,0,0.5)"
                  >
                    Fresh &amp; Wholesome
                  </Text>
                  <Text
                    fontSize={{ base: "16px", md: "19px" }}
                    color="whiteAlpha.900"
                    textAlign="center"
                    maxW="320px"
                    lineHeight="1.6"
                    fontFamily="var(--font-lora)"
                    textShadow="0 1px 8px rgba(0,0,0,0.5)"
                  >
                    From smoothies to salads — real food, real good
                  </Text>
                </MotionVStack>
              )}
            </AnimatePresence>
          </Flex>
        </SwiperSlide>

        {/* ── SLIDE 3: How to Order ── */}
        <SwiperSlide>
          <Flex
            h="100vh"
            w="100%"
            bgGradient="linear(to-br, orange.300, orange.500)"
            direction="column"
            justify="center"
            align="center"
            px={6}
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset={0}
              bgImage="url('/soul-good-logo.png')"
              bgRepeat="no-repeat"
              bgPos="bottom right"
              bgSize="40%"
              opacity={0.06}
              pointerEvents="none"
            />
            <AnimatePresence mode="wait">
              {activeSlide === 2 && (
                <MotionVStack
                  key="slide3"
                  spacing={8}
                  align="center"
                  w="100%"
                  maxW="400px"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <VStack spacing={1}>
                    <Text
                      fontSize={{ base: "32px", md: "42px" }}
                      fontWeight="700"
                      color="white"
                      textAlign="center"
                      lineHeight="1.15"
                      fontFamily="var(--font-recoleta)"
                      textShadow="0 2px 10px rgba(0,0,0,0.15)"
                    >
                      Order in 3
                    </Text>
                    <Text
                      fontSize={{ base: "32px", md: "42px" }}
                      fontWeight="700"
                      color="white"
                      textAlign="center"
                      lineHeight="1.15"
                      fontFamily="var(--font-recoleta)"
                      textShadow="0 2px 10px rgba(0,0,0,0.15)"
                    >
                      Easy Steps
                    </Text>
                  </VStack>

                  <VStack spacing={4} w="100%" align="stretch">
                    {[
                      { icon: GiKnifeFork, step: "1", label: "Browse the Menu", sub: "Explore our full range of healthy dishes" },
                      { icon: FiShoppingCart, step: "2", label: "Add to Cart", sub: "Pick your favorites and set your quantity" },
                      { icon: FiSmile, step: "3", label: "Enjoy!", sub: "We'll prepare your order fresh just for you" },
                    ].map(({ icon: Icon, step, label, sub }) => (
                      <HStack
                        key={step}
                        spacing={4}
                        bg="whiteAlpha.300"
                        borderRadius="16px"
                        px={5}
                        py={4}
                        backdropFilter="blur(8px)"
                      >
                        <Flex
                          w="44px"
                          h="44px"
                          borderRadius="full"
                          bg="white"
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Box as={Icon} size="22px" color="orange.500" />
                        </Flex>
                        <VStack align="flex-start" spacing={0}>
                          <Text fontSize="15px" fontWeight="700" color="white" lineHeight="1.2">
                            {label}
                          </Text>
                          <Text fontSize="13px" color="whiteAlpha.800" lineHeight="1.4">
                            {sub}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </MotionVStack>
              )}
            </AnimatePresence>
          </Flex>
        </SwiperSlide>

        {/* ── SLIDE 4: Location + Sign In ── */}
        <SwiperSlide>
          <Flex
            h="100vh"
            w="100%"
            position="relative"
            direction="column"
            justify="center"
            align="center"
            overflow="hidden"
          >
            {/* Background promo photo */}
            <Box
              position="absolute"
              inset={0}
              bgImage="url('/slides.jpg')"
              bgSize="cover"
              bgPos="center"
            />
            {/* Dark overlay */}
            <Box position="absolute" inset={0} bg="blackAlpha.650" />

            <AnimatePresence mode="wait">
              {activeSlide === 3 && (
                <MotionVStack
                  key="slide4"
                  spacing={6}
                  align="center"
                  px={8}
                  position="relative"
                  zIndex={2}
                  w="100%"
                  maxW="400px"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <VStack spacing={3} align="center">
                    <Text
                      fontSize={{ base: "36px", md: "46px" }}
                      fontWeight="700"
                      color="white"
                      textAlign="center"
                      lineHeight="1.1"
                      fontFamily="var(--font-recoleta)"
                      textShadow="0 2px 16px rgba(0,0,0,0.4)"
                    >
                      Come Visit Us
                    </Text>
                    <HStack spacing={2} align="flex-start">
                      <Box as={FaMapMarkerAlt} color="orange.300" mt="3px" flexShrink={0} />
                      <Text
                        fontSize="15px"
                        color="whiteAlpha.900"
                        textAlign="center"
                        lineHeight="1.6"
                        fontFamily="var(--font-lora)"
                        textShadow="0 1px 8px rgba(0,0,0,0.4)"
                      >
                        57 E Capitol Dr, Kapitolyo, Pasig
                        <br />
                        Open Monday – Sunday
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Sign in button */}
                  <Button
                    onClick={() => navigate("/login")}
                    bg="white"
                    color="orange.600"
                    w="full"
                    size="lg"
                    borderRadius="full"
                    fontWeight="600"
                    fontSize="15px"
                    h="52px"
                    leftIcon={
                      <Image
                        src="https://www.svgrepo.com/show/355037/google.svg"
                        alt="Google"
                        boxSize={5}
                      />
                    }
                    _hover={{ bg: "orange.50", transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s"
                    boxShadow="0 4px 16px rgba(0,0,0,0.3)"
                  >
                    Sign in with Google
                  </Button>

                  <Text fontSize="13px" color="whiteAlpha.700" textAlign="center" fontFamily="var(--font-lora)">
                    Order online · Pick up in store
                  </Text>
                </MotionVStack>
              )}
            </AnimatePresence>
          </Flex>
        </SwiperSlide>
      </Swiper>
    </Box>
  );
}
