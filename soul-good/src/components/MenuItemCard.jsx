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
} from "@chakra-ui/react";

export default function MenuItemCard({ item, imgFallback = "/default-food.jpg" }) {
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
      <Box
        bg={bg}
        rounded="2xl"
        shadow="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="rgba(0,0,0,0.03)"
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
            h={{ base: "180px", md: "220px" }}
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
        </Box>

        <VStack align="start" spacing={3} p={5}>
          <HStack justify="space-between" w="100%">
            <Heading size="md" color={textColor}>
              {item.name}
            </Heading>
          </HStack>

          <Text color="gray.500" fontSize="sm" noOfLines={2}>
            {item.description || "—"}
          </Text>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <HStack spacing={2} wrap="wrap">
              {item.tags.map((t) => (
                <Badge key={t} colorScheme="orange" variant="subtle">
                  {t}
                </Badge>
              ))}
            </HStack>
          )}

          {/* Nutrition preview (just calories + protein quick peek) */}
          <HStack justify="space-between" w="100%" pt={2}>
            <Text fontSize="sm" color="gray.500">
              {item.calories ? `${item.calories}` : "—"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.protein ? `${item.protein} protein` : "— protein"}
            </Text>
          </HStack>

          <Text fontSize="xs" color="gray.400" mt={2}>
            Tap anywhere on the card for details
          </Text>
        </VStack>
      </Box>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{item.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Image
                src={item.image || imgFallback}
                alt={item.name}
                borderRadius="md"
                objectFit="cover"
                fallbackSrc={imgFallback}
              />

              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                  ₱{item.price}
                </Text>
              </HStack>

              <Text color="gray.600">
                {item.description || "No description available."}
              </Text>

              {/* Tags */}
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

              {/* Nutrition */}
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

              {/* Allergens */}
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
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
