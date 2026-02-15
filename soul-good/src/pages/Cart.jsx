import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Link,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <Box minH="100vh" p={6} bg="orange.50">
      <HStack justify="space-between" mb={4}>
        <Heading fontFamily="var(--font-lora)">Your Cart</Heading>
        <Button as={RouterLink} to="/menu" variant="ghost" colorScheme="orange" size="sm">
          Continue Shopping
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch">
        {cartItems.length === 0 ? (
          <VStack spacing={4} py={8}>
            <Text color="gray.600" fontSize="lg">Your cart is empty.</Text>
            <Button as={RouterLink} to="/menu" colorScheme="orange">
              Browse Menu
            </Button>
          </VStack>
        ) : (
          <>
            {cartItems.map((it) => (
              <Box key={it.id} bg="white" p={4} borderRadius="md" shadow="sm">
                <HStack align="center" spacing={4}>
                  <Image
                    src={it.image || "/default-food.jpg"}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Box flex={1}>
                    <Text fontWeight="bold" fontFamily="var(--font-the-seasons)">
                      {it.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500" fontFamily="var(--font-the-seasons)">
                      ₱{it.price}
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    <NumberInput
                      size="sm"
                      maxW={20}
                      min={1}
                      value={it.quantity}
                      onChange={(v) => updateQuantity(it.id, Number(v || 1))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <IconButton
                      aria-label="Remove item"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeFromCart(it.id)}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}

            <Divider />
            <HStack justify="space-between" py={2}>
              <Text fontWeight="bold" fontSize="lg" fontFamily="var(--font-lora)">
                Total
              </Text>
              <Text fontWeight="bold" fontSize="xl" fontFamily="var(--font-the-seasons)">
                ₱{cartTotal.toFixed(2)}
              </Text>
            </HStack>

            <Button colorScheme="orange" size="lg" isDisabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
}
