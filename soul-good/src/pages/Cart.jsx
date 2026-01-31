import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

export default function Cart() {
  const user = JSON.parse(localStorage.getItem("soulgood_user") || "null");
  const [items, setItems] = useState([]);

  const fetchCart = () => {
    if (!user) return;
    fetch(`/api/cart?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id, qty) => {
    try {
      await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`/api/cart/${id}`, { method: "DELETE" });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

  return (
    <Box minH="100vh" p={6} bg="orange.50">
      <Heading mb={4}>Your Cart</Heading>
      <VStack spacing={4} align="stretch">
        {items.length === 0 && <Text color="gray.600">Your cart is empty.</Text>}
        {items.map((it) => (
          <Box key={it.id} bg="white" p={4} borderRadius="md" shadow="sm">
            <HStack align="center">
              <Image src={it.image || "/default-food.jpg"} boxSize="60px" objectFit="cover" borderRadius="md" />
              <Box flex={1}>
                <Text fontWeight="bold">{it.name}</Text>
                <Text fontSize="sm" color="gray.500">₱{it.price}</Text>
              </Box>
              <HStack>
                <NumberInput size="sm" maxW={24} min={1} value={it.quantity} onChange={(v) => updateQty(it.id, Number(v || 1))}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <IconButton aria-label="remove" icon={<FaTrash />} onClick={() => removeItem(it.id)} />
              </HStack>
            </HStack>
          </Box>
        ))}

        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Total</Text>
          <Text fontWeight="bold">₱{total.toFixed(2)}</Text>
        </HStack>

        <Button colorScheme="orange" isDisabled={items.length === 0}>Proceed to Checkout</Button>
      </VStack>
    </Box>
  );
}
