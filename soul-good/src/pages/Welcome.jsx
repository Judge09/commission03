import { Box, Button, Center, VStack, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Center minH="100vh" bg="#202124">
      <VStack spacing={6}>
        <Image
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
          alt="Google Logo"
          h="40px"
        />
        <Text fontSize="2xl" color="white">
          Welcome to Soul Good
        </Text>
        <Button
          onClick={() => navigate("/login")}
          bg="white"
          color="gray.700"
          border="1px solid #dadce0"
          _hover={{ bg: "#f8f9fa" }}
          leftIcon={
            <Image
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google Icon"
              boxSize="20px"
            />
          }
        >
          Sign in with Google
        </Button>
      </VStack>
    </Center>
  );
}
