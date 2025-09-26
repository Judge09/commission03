import {
  Box,
  Button,
  Center,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Center
      minH="100vh"
      bgGradient="linear(to-b, orange.200, orange.300, orange.400)"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="2xl"
        shadow="2xl"
        textAlign="center"
        w="100%"
        maxW="400px"
        position="relative"
      >
        {/* Background silhouettes */}
        <Box
          position="absolute"
          inset={0}
          bgImage="url('https://www.svgrepo.com/show/492889/restaurant.svg')"
          bgRepeat="no-repeat"
          bgPos="center"
          bgSize="200px"
          opacity={0.05}
          zIndex={0}
        />

        <VStack spacing={6} position="relative" zIndex={1}>
          {/* Actual Logo */}
          <Image
            src="/soul-good-logo.png" // <-- save your logo in public/ as soul-good-logo.png
            alt="Soul Good Logo"
            w="200px"
            mx="auto"
          />

          <Text fontSize="md" color="gray.600">
            Discover soulful flavors and order with ease
          </Text>

          {/* Sign in button */}
          <Button
            onClick={() => navigate("/login")}
            bg="white"
            color="gray.700"
            border="1px solid"
            borderColor="gray.300"
            _hover={{ bg: "gray.100" }}
            w="full"
            leftIcon={
              <Image
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google Icon"
                boxSize={5}
              />
            }
          >
            Sign in with Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
