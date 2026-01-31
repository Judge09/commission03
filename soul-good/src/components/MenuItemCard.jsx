import React from "react";
import {
  Box,
  Image,
  Badge,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MenuItemCard({ item, imgFallback = "/default-food.jpg", isFavorite = false, onToggleFavorite, onAddToCart }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <>
      {/* Default Card (unchanged) */}
      <Box
        bg={bg}
        rounded="2xl"
        shadow="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="rgba(0,0,0,0.05)"
        cursor="pointer"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        transition="transform 150ms ease, box-shadow 150ms ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      >
        <Box position="relative">
          <Image
            src={item.image || imgFallback}
            alt={item.name}
            objectFit="cover"
            w="100%"
            h={{ base: "160px", md: "220px" }}
            fallbackSrc={imgFallback}
          />

          <Badge
            position="absolute"
            top={3}
            right={3}
            bg="whiteAlpha.900"
            color="gray.800"
            px={3}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
            boxShadow="sm"
          >
            ₱{item.price}
          </Badge>

          {/* Favorite button */}
          <IconButton
            aria-label="favorite"
            icon={isFavorite ? <FaHeart color="#e53e3e" /> : <FaRegHeart />}
            position="absolute"
            top={3}
            left={3}
            size="sm"
            bg="whiteAlpha.900"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite();
            }}
          />
        </Box>

        <VStack
          align="start"
          spacing={2}
          p={4}
          minH={{ base: "100px", md: "auto" }}
        >
          <Heading size="sm" color={textColor} noOfLines={1}>
            {item.name}
          </Heading>

          {/* Mobile hides extra stuff */}
          <Text
            color="gray.500"
            fontSize="xs"
            noOfLines={1}
            display={{ base: "none", md: "block" }}
          >
            {item.description || "—"}
          </Text>

          {/* Quick tip for mobile */}
          <Text fontSize="xs" color="gray.400" mt={1}>
            Tap for details
          </Text>
        </VStack>
      </Box>

      {/* Modal (adjusted for mobile, scrollable) */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md", lg: "lg" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody maxH="70vh" overflowY="auto">
            <Stack spacing={4}>
              <Image
                src={item.image || imgFallback}
                alt={item.name}
                borderRadius="md"
                objectFit="cover"
                fallbackSrc={imgFallback}
                maxH={{ base: "180px", md: "250px" }}
              />

              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                  ₱{item.price}
                </Text>
              </HStack>

              <Text color="gray.600">
                {item.description || "No description available."}
              </Text>

              {item.tags && item.tags.length > 0 && (
                <HStack spacing={2} wrap="wrap">
                  {item.tags.map((t) => (
                    <Badge key={t} colorScheme="orange" variant="subtle">
                      {t}
                    </Badge>
                  ))}
                </HStack>
              )}

              <Divider />

              <Box>
                <Heading size="sm" mb={2}>
                  Nutrition
                </Heading>
                <Stack spacing={1}>
                  {item.nutrition
                    ? Object.entries(item.nutrition).map(([key, value]) => (
                        <Text key={key} fontSize="sm" color="gray.500">
                          {`${key[0].toUpperCase() + key.slice(1)}: ${
                            value || "—"
                          }`}
                        </Text>
                      ))
                    : (
                      <>
                        <Text fontSize="sm" color="gray.500">
                          Calories: {item.calories || "—"}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Protein: {item.protein || "—"}
                        </Text>
                      </>
                    )}
                </Stack>
              </Box>

              {item.ingredients && item.ingredients.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Ingredients
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {item.ingredients.map((ing) => ing.toLowerCase()).join(", ")}
                  </Text>
                </Box>
              )}

              {item.allergens && item.allergens.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>
                    Allergens
                  </Heading>
                  <Text fontSize="sm" color="red.500">
                    {item.allergens.join(", ")}
                  </Text>
                </Box>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Close
            </Button>
            <Button colorScheme="orange" onClick={() => onAddToCart && onAddToCart()}>
              Add to Cart
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
