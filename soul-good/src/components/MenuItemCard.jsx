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
  useBreakpointValue,
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
  Flex,
} from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

// Inline +/- stepper — used both on the card and inside the modal
function QuantityStepper({ quantity, onAdd, onRemove, size = "sm", compact = false }) {
  if (quantity === 0) {
    return (
      <Button
        size={compact ? "xs" : size}
        colorScheme="orange"
        borderRadius="full"
        px={compact ? 3 : 5}
        fontSize={compact ? "11px" : undefined}
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        fontFamily="var(--font-lora)"
        w={compact ? "full" : undefined}
      >
        {compact ? "+ Add" : "Add to Cart"}
      </Button>
    );
  }
  return (
    <HStack
      spacing={compact ? 1 : 2}
      bg="orange.500"
      borderRadius="full"
      px={compact ? 1 : 2}
      py={1}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        aria-label="decrease"
        icon={<MinusIcon boxSize={compact ? "8px" : undefined} />}
        size="xs"
        variant="ghost"
        color="white"
        _hover={{ bg: "orange.600" }}
        borderRadius="full"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
      />
      <Text color="white" fontWeight="700" fontSize="sm" minW="16px" textAlign="center">
        {quantity}
      </Text>
      <IconButton
        aria-label="increase"
        icon={<AddIcon boxSize={compact ? "8px" : undefined} />}
        size="xs"
        variant="ghost"
        color="white"
        _hover={{ bg: "orange.600" }}
        borderRadius="full"
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
      />
    </HStack>
  );
}

export default function MenuItemCard({
  item,
  imgFallback = "/default-food.jpg",
  isFavorite = false,
  quantity = 0,
  onToggleFavorite,
  onAdd,
  onRemove,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const compactStepper = useBreakpointValue({ base: true, md: false });
  const isActive = isFavorite && quantity > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
  };

  return (
    <>
      <Box
        bg={isActive ? "orange.100" : isFavorite ? "orange.50" : bg}
        rounded="2xl"
        shadow={isActive ? "lg" : "md"}
        overflow="hidden"
        borderWidth="2px"
        borderColor={isActive ? "orange.400" : isFavorite ? "orange.300" : "rgba(0,0,0,0.05)"}
        cursor="pointer"
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        transition="transform 150ms ease, box-shadow 150ms ease, background-color 200ms ease"
        _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
        display="flex"
        flexDirection="column"
      >
        {/* Image */}
        <Box position="relative" flexShrink={0}>
          <Image
            src={item.image || imgFallback}
            alt={item.name}
            objectFit="cover"
            w="100%"
            h={{ base: "140px", md: "200px" }}
            fallbackSrc={imgFallback}
          />
          {/* Price badge */}
          <Badge
            position="absolute"
            top={2}
            right={2}
            bg="whiteAlpha.900"
            color="gray.800"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
            boxShadow="sm"
            fontFamily="var(--font-the-seasons)"
            fontSize="xs"
          >
            ₱{item.price}
          </Badge>
          {/* In-cart badge */}
          {quantity > 0 && (
            <Badge
              position="absolute"
              top={2}
              left={2}
              bg="orange.500"
              color="white"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
              fontWeight="700"
            >
              {quantity} in cart
            </Badge>
          )}
          {/* Favorite button */}
          <IconButton
            aria-label="favorite"
            icon={isFavorite ? <FaHeart color="#e53e3e" /> : <FaRegHeart />}
            position="absolute"
            bottom={2}
            right={2}
            size="sm"
            bg="whiteAlpha.900"
            borderRadius="full"
            onClick={(e) => { e.stopPropagation(); if (onToggleFavorite) onToggleFavorite(); }}
          />
        </Box>

        {/* Card body */}
        <Flex direction="column" justify="space-between" flex="1" p={{ base: 2, md: 3 }} gap={2}>
          <Heading size="sm" color={textColor} noOfLines={1} fontFamily="var(--font-the-seasons)">
            {item.name}
          </Heading>
          <Text color="gray.500" fontSize="xs" noOfLines={1} display={{ base: "none", md: "block" }}>
            {item.description || "—"}
          </Text>

          {/* Stepper pinned to bottom of card */}
          <Flex justify="center" pt={1} onClick={(e) => e.stopPropagation()}>
            <QuantityStepper quantity={quantity} onAdd={onAdd} onRemove={onRemove} compact={compactStepper} />
          </Flex>
        </Flex>
      </Box>

      {/* Detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "md", lg: "lg" }} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="var(--font-the-seasons)" pr={10}>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Image
                src={item.image || imgFallback}
                alt={item.name}
                borderRadius="md"
                objectFit="cover"
                fallbackSrc={imgFallback}
                maxH={{ base: "180px", md: "240px" }}
                w="100%"
              />

              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" fontSize="lg" fontFamily="var(--font-the-seasons)">
                  ₱{item.price}
                </Text>
                {/* Stepper inside modal */}
                <QuantityStepper quantity={quantity} onAdd={onAdd} onRemove={onRemove} size="md" />
              </HStack>

              <Text color="gray.600">
                {item.description || "No description available."}
              </Text>

              {item.tags && item.tags.length > 0 && (
                <HStack spacing={2} wrap="wrap">
                  {item.tags.map((t) => (
                    <Badge key={t} colorScheme="orange" variant="subtle">{t}</Badge>
                  ))}
                </HStack>
              )}

              <Divider />

              <Box>
                <Heading size="sm" mb={2} fontFamily="var(--font-sachez)">Nutrition</Heading>
                <Stack spacing={1}>
                  {item.nutrition
                    ? Object.entries(item.nutrition).map(([key, value]) => (
                        <Text key={key} fontSize="sm" color="gray.500">
                          {`${key[0].toUpperCase() + key.slice(1)}: ${value || "—"}`}
                        </Text>
                      ))
                    : (
                      <>
                        <Text fontSize="sm" color="gray.500">Calories: {item.calories || "—"}</Text>
                        <Text fontSize="sm" color="gray.500">Protein: {item.protein || "—"}</Text>
                      </>
                    )}
                </Stack>
              </Box>

              {item.ingredients && item.ingredients.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>Ingredients</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {item.ingredients.map((ing) => ing.toLowerCase()).join(", ")}
                  </Text>
                </Box>
              )}

              {item.allergens && item.allergens.length > 0 && (
                <Box>
                  <Heading size="sm" mb={2}>Allergens</Heading>
                  <Text fontSize="sm" color="red.500">{item.allergens.join(", ")}</Text>
                </Box>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
