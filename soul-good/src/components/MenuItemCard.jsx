// src/components/MenuItemCard.jsx
import React from "react";
import {
  Box,
  Image,
  Badge,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function MenuItemCard({ item, imgFallback = "/default-food.jpg" }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("white", "gray.800");

  return (
    <>
      <Box
        bg={bg}
        rounded="2xl"
        shadow="sm"
        borderWidth="1px"
        borderColor="rgba(0,0,0,0.05)"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ shadow: "xl", transform: "translateY(-5px)" }}
      >
        {/* Image + Price Badge */}
        <Box position="relative">
          <Image
            src={item.image || imgFallback}
            alt={item.name}
            objectFit="cover"
            w="100%"
            h={{ base: "180px", md: "220px" }}
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

        {/* Card Content */}
        <VStack align="start" spacing={3} p={4}>
          <HStack justify="space-between" w="100%">
            <Heading size="md">{item.name}</Heading>
            {item.badge && (
              <Badge colorScheme={item.badge === "Vegan" ? "green" : "orange"}>
                {item.badge}
              </Badge>
            )}
          </HStack>

          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {item.description}
          </Text>

          <HStack spacing={2} wrap="wrap">
            {item.tags?.map((t) => (
              <Badge key={t} colorScheme="orange" variant="subtle">
                {t}
              </Badge>
            ))}
          </HStack>

          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color="gray.500">
              {item.calories} cal
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.protein}g protein
            </Text>
          </HStack>

          <Button
            variant="outline"
            colorScheme="orange"
            w="full"
            borderRadius="lg"
            onClick={onOpen}
          >
            More Info
          </Button>
        </VStack>
      </Box>

      {/* Modal */}
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
              />
              <HStack justify="space-between">
                {item.badge && (
                  <Badge colorScheme={item.badge === "Vegan" ? "green" : "orange"}>
                    {item.badge}
                  </Badge>
                )}
                <Text fontWeight="bold">₱{item.price}</Text>
              </HStack>
              <Text color="gray.600">{item.description}</Text>
              <HStack spacing={2} wrap="wrap">
                {item.tags?.map((t) => (
                  <Badge key={t} colorScheme="orange" variant="subtle">
                    {t}
                  </Badge>
                ))}
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm" color="gray.500">
                  {item.calories} cal
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {item.protein}g protein
                </Text>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="orange">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
