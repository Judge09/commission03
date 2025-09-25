import { VStack, Heading, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <VStack h="100vh" justify="center" spacing={6} px={4} bg="gray.50">
      <Image src="/logo.png" alt="Soul Good Logo" boxSize="100px" />
      <Heading>Welcome to Soul Good</Heading>
      <Text fontSize="lg" color="gray.600">
        Your favorite healthy treats, just a click away.
      </Text>
      <Button colorScheme="brand" size="lg" onClick={() => navigate("/login")}>
        Sign in
      </Button>
    </VStack>
  );
}
