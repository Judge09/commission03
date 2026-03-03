import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Button,
  IconButton,
  Divider,
  Badge,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaShoppingCart, FaCheckCircle, FaStore, FaMotorcycle } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import Logo from "/soul-good-logo.png";

function QuantityStepper({ quantity, onIncrease, onDecrease }) {
  return (
    <HStack spacing={0} bg="orange.500" borderRadius="full" px={1} py={1}>
      <IconButton
        aria-label="decrease"
        icon={<MinusIcon boxSize="10px" />}
        size="xs"
        variant="ghost"
        color="white"
        borderRadius="full"
        _hover={{ bg: "orange.600" }}
        onClick={onDecrease}
      />
      <Text color="white" fontWeight="700" fontSize="sm" minW="24px" textAlign="center">
        {quantity}
      </Text>
      <IconButton
        aria-label="increase"
        icon={<AddIcon boxSize="10px" />}
        size="xs"
        variant="ghost"
        color="white"
        borderRadius="full"
        _hover={{ bg: "orange.600" }}
        onClick={onIncrease}
      />
    </HStack>
  );
}

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [orderType, setOrderType] = useState("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleIncrease = (item) => updateQuantity(item.id, item.quantity + 1);
  const handleDecrease = (item) => updateQuantity(item.id, item.quantity - 1);

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Please fill in your name and phone number.",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (orderType === "delivery" && !address.trim()) {
      toast({
        title: "Please enter a delivery address.",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    // Simulate order submission delay
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    if (submitted) {
      clearCart();
      setSubmitted(false);
      setName("");
      setPhone("");
      setAddress("");
      setNotes("");
      setOrderType("pickup");
    }
    onClose();
  };

  return (
    <Box minH="100vh" bg="orange.50">
      {/* Navbar */}
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
        <Button as={RouterLink} to="/menu" colorScheme="orange" variant="ghost" size="sm">
          ← Back to Menu
        </Button>
      </HStack>

      <Container maxW="container.md" py={{ base: 6, md: 10 }}>
        {/* Page title */}
        <HStack mb={6} spacing={3} align="center">
          <Icon as={FaShoppingCart} color="orange.500" boxSize={6} />
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="orange.700" fontFamily="var(--font-recoleta)">
            Your Cart
          </Heading>
          {cartItems.length > 0 && (
            <Badge colorScheme="orange" borderRadius="full" px={3} py={1} fontSize="sm">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </HStack>

        {cartItems.length === 0 ? (
          <VStack spacing={5} py={16} bg="white" borderRadius="2xl" boxShadow="md" align="center">
            <Icon as={FaShoppingCart} boxSize={14} color="orange.200" />
            <VStack spacing={1}>
              <Text fontWeight="600" fontSize="lg" color="gray.700" fontFamily="var(--font-the-seasons)">
                Your cart is empty
              </Text>
              <Text fontSize="sm" color="gray.400" fontFamily="var(--font-lora)">
                Add some delicious items from the menu
              </Text>
            </VStack>
            <Button as={RouterLink} to="/menu" colorScheme="orange" borderRadius="full" px={8} fontFamily="var(--font-lora)">
              Browse Menu
            </Button>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            {/* Cart items */}
            <VStack spacing={3} align="stretch">
              {cartItems.map((item) => (
                <Box
                  key={item.id}
                  bg="white"
                  borderRadius="2xl"
                  boxShadow="sm"
                  p={4}
                  borderWidth="1px"
                  borderColor="orange.100"
                  transition="box-shadow 0.15s"
                  _hover={{ boxShadow: "md" }}
                >
                  <HStack spacing={4} align="center">
                    <Image
                      src={item.image || "/default-food.jpg"}
                      fallbackSrc="/default-food.jpg"
                      boxSize={{ base: "64px", md: "80px" }}
                      objectFit="cover"
                      borderRadius="xl"
                      flexShrink={0}
                    />
                    <Box flex={1} minW={0}>
                      <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }} noOfLines={1} fontFamily="var(--font-the-seasons)" color="gray.800">
                        {item.name}
                      </Text>
                      <Text fontSize="sm" color="gray.400" fontFamily="var(--font-lora)">
                        ₱{item.price} each
                      </Text>
                    </Box>
                    <VStack spacing={1} align="flex-end" flexShrink={0}>
                      <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => handleIncrease(item)}
                        onDecrease={() => handleDecrease(item)}
                      />
                      <Text fontWeight="700" fontSize="sm" color="orange.600" fontFamily="var(--font-the-seasons)">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </VStack>
                    <IconButton
                      aria-label="Remove item"
                      icon={<FaTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      borderRadius="full"
                      flexShrink={0}
                      onClick={() => removeFromCart(item.id)}
                    />
                  </HStack>
                </Box>
              ))}
            </VStack>

            {/* Order summary */}
            <Box bg="white" borderRadius="2xl" boxShadow="md" p={{ base: 5, md: 6 }} borderWidth="1px" borderColor="orange.100" mt={2}>
              <Heading fontSize="lg" color="orange.700" fontFamily="var(--font-recoleta)" mb={4}>
                Order Summary
              </Heading>
              <VStack spacing={2} align="stretch">
                {cartItems.map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <Text fontSize="sm" color="gray.600" fontFamily="var(--font-lora)" noOfLines={1} flex={1} mr={2}>
                      {item.name}{" "}
                      <Text as="span" color="gray.400">×{item.quantity}</Text>
                    </Text>
                    <Text fontSize="sm" fontWeight="600" fontFamily="var(--font-the-seasons)" flexShrink={0}>
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </HStack>
                ))}
              </VStack>
              <Divider my={4} borderColor="orange.100" />
              <HStack justify="space-between">
                <Text fontWeight="700" fontSize="md" fontFamily="var(--font-lora)" color="gray.700">Total</Text>
                <Text fontWeight="800" fontSize="xl" fontFamily="var(--font-the-seasons)" color="orange.600">
                  ₱{cartTotal.toFixed(2)}
                </Text>
              </HStack>
            </Box>

            {/* Checkout button */}
            <Button
              colorScheme="orange"
              size="lg"
              borderRadius="full"
              fontFamily="var(--font-lora)"
              fontWeight="600"
              py={7}
              fontSize="md"
              onClick={onOpen}
            >
              Proceed to Checkout
            </Button>

            <Button as={RouterLink} to="/menu" variant="ghost" colorScheme="orange" size="sm" fontFamily="var(--font-lora)">
              ← Continue Shopping
            </Button>
          </VStack>
        )}
      </Container>

      {/* Checkout Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: "full", md: "lg" }} isCentered scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius={{ base: 0, md: "2xl" }} overflow="hidden">

          {submitted ? (
            /* ── Success state ── */
            <>
              <ModalCloseButton />
              <ModalBody py={12}>
                <VStack spacing={5} align="center" textAlign="center">
                  <Icon as={FaCheckCircle} boxSize={16} color="green.400" />
                  <Heading fontSize="2xl" fontFamily="var(--font-recoleta)" color="gray.800">
                    Order Placed!
                  </Heading>
                  <Text color="gray.500" fontFamily="var(--font-lora)" maxW="300px" lineHeight="1.7">
                    Thank you, <strong>{name}</strong>! We've received your order and will prepare it fresh for you.
                  </Text>
                  {orderType === "pickup" ? (
                    <Badge colorScheme="orange" px={4} py={2} borderRadius="full" fontSize="sm">
                      Pick up at 57 E Capitol Dr, Kapitolyo, Pasig
                    </Badge>
                  ) : (
                    <Badge colorScheme="blue" px={4} py={2} borderRadius="full" fontSize="sm">
                      Delivering to: {address}
                    </Badge>
                  )}
                  <Button
                    colorScheme="orange"
                    borderRadius="full"
                    px={10}
                    fontFamily="var(--font-lora)"
                    onClick={handleClose}
                    mt={2}
                  >
                    Back to Menu
                  </Button>
                </VStack>
              </ModalBody>
            </>
          ) : (
            /* ── Form state ── */
            <>
              <ModalHeader
                bgGradient="linear(to-r, orange.400, orange.500)"
                color="white"
                fontFamily="var(--font-recoleta)"
                fontSize="xl"
                pb={4}
              >
                Checkout
              </ModalHeader>
              <ModalCloseButton color="white" />

              <ModalBody py={6}>
                <VStack spacing={5} align="stretch">

                  {/* Order type */}
                  <FormControl>
                    <FormLabel fontWeight="600" fontFamily="var(--font-lora)" color="gray.700" mb={2}>
                      Order Type
                    </FormLabel>
                    <RadioGroup value={orderType} onChange={setOrderType}>
                      <Stack direction="row" spacing={4}>
                        <Radio
                          value="pickup"
                          colorScheme="orange"
                          fontFamily="var(--font-lora)"
                        >
                          <HStack spacing={2}>
                            <Icon as={FaStore} color="orange.500" />
                            <Text fontSize="sm">Pick Up</Text>
                          </HStack>
                        </Radio>
                        <Radio
                          value="delivery"
                          colorScheme="orange"
                          fontFamily="var(--font-lora)"
                        >
                          <HStack spacing={2}>
                            <Icon as={FaMotorcycle} color="orange.500" />
                            <Text fontSize="sm">Delivery</Text>
                          </HStack>
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

                  <Divider />

                  {/* Contact info */}
                  <FormControl isRequired>
                    <FormLabel fontWeight="600" fontFamily="var(--font-lora)" color="gray.700" fontSize="sm">
                      Full Name
                    </FormLabel>
                    <Input
                      placeholder="e.g. Juan dela Cruz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      borderRadius="lg"
                      fontFamily="var(--font-lora)"
                      focusBorderColor="orange.400"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="600" fontFamily="var(--font-lora)" color="gray.700" fontSize="sm">
                      Phone Number
                    </FormLabel>
                    <Input
                      placeholder="e.g. 09XX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      type="tel"
                      borderRadius="lg"
                      fontFamily="var(--font-lora)"
                      focusBorderColor="orange.400"
                    />
                  </FormControl>

                  {orderType === "delivery" && (
                    <FormControl isRequired>
                      <FormLabel fontWeight="600" fontFamily="var(--font-lora)" color="gray.700" fontSize="sm">
                        Delivery Address
                      </FormLabel>
                      <Textarea
                        placeholder="Enter your full delivery address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        borderRadius="lg"
                        fontFamily="var(--font-lora)"
                        focusBorderColor="orange.400"
                        rows={2}
                        resize="none"
                      />
                    </FormControl>
                  )}

                  <FormControl>
                    <FormLabel fontWeight="600" fontFamily="var(--font-lora)" color="gray.700" fontSize="sm">
                      Special Instructions{" "}
                      <Text as="span" color="gray.400" fontWeight="400">(optional)</Text>
                    </FormLabel>
                    <Textarea
                      placeholder="Allergies, no spice, extra sauce..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      borderRadius="lg"
                      fontFamily="var(--font-lora)"
                      focusBorderColor="orange.400"
                      rows={2}
                      resize="none"
                    />
                  </FormControl>

                  <Divider />

                  {/* Mini order summary */}
                  <Box bg="orange.50" borderRadius="xl" p={4} borderWidth="1px" borderColor="orange.100">
                    <Text fontWeight="700" fontSize="sm" color="orange.700" fontFamily="var(--font-lora)" mb={3}>
                      Your Order
                    </Text>
                    <VStack spacing={1} align="stretch">
                      {cartItems.map((item) => (
                        <HStack key={item.id} justify="space-between">
                          <Text fontSize="xs" color="gray.600" fontFamily="var(--font-lora)" noOfLines={1} flex={1}>
                            {item.name} ×{item.quantity}
                          </Text>
                          <Text fontSize="xs" fontWeight="600" fontFamily="var(--font-the-seasons)" flexShrink={0}>
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                    <Divider my={3} borderColor="orange.200" />
                    <HStack justify="space-between">
                      <Text fontWeight="700" fontSize="sm" fontFamily="var(--font-lora)" color="gray.700">Total</Text>
                      <Text fontWeight="800" fontSize="md" fontFamily="var(--font-the-seasons)" color="orange.600">
                        ₱{cartTotal.toFixed(2)}
                      </Text>
                    </HStack>
                  </Box>
                </VStack>
              </ModalBody>

              <ModalFooter gap={3} borderTop="1px solid" borderColor="orange.100">
                <Button variant="ghost" onClick={handleClose} fontFamily="var(--font-lora)">
                  Cancel
                </Button>
                <Button
                  colorScheme="orange"
                  borderRadius="full"
                  px={8}
                  fontFamily="var(--font-lora)"
                  fontWeight="600"
                  isLoading={loading}
                  loadingText="Placing order..."
                  onClick={handlePlaceOrder}
                >
                  Place Order · ₱{cartTotal.toFixed(2)}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}
