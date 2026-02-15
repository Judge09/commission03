import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Link,
  Text,
  VStack,
  Image,
  Select,
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect to intended destination if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async () => {
    if (!email) return alert("Please enter your Gmail address.");
    if (!email.toLowerCase().endsWith("@gmail.com")) return alert("Please use your Gmail address (example@gmail.com)");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");

      // Note: Backend should return accessToken and refreshToken
      // For now, we'll use the user data as a temporary token until backend is updated
      const accessToken = data.accessToken || `temp_token_${data.user.id}`;
      const refreshToken = data.refreshToken || `temp_refresh_${data.user.id}`;

      // Use the auth context login method
      login(accessToken, refreshToken, data.user);

      // Navigate to intended destination or menu
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to login.");
    }
  };

  return (
    <Flex
      minH="100vh"
      bg="#000000"
      justify="space-between"
      align="center"
      direction="column"
      fontFamily="Arial, sans-serif"
    >
      {/* Main content */}
      <Flex
        direction="column"
        w="100%"
        maxW="450px"
        mx="auto"
        flex="1"
        justify="center"
        px={{ base: 6, sm: 0 }}
        color="white"
      >
        <VStack align="stretch" spacing={6}>
          {/* Google logo */}
          <Image
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            alt="Google logo"
            boxSize="40px"
            mb={2}
          />

          {/* Title */}
          <Box>
            <Text fontSize="2xl" fontWeight="400">
              Sign in
            </Text>
            <Text fontSize="md" color="gray.400">
              Use your Gmail address (example@gmail.com)
            </Text>
          </Box>

          {/* Enter Gmail address only */}
          <Box>
            <Input
              placeholder="yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="transparent"
              borderColor="gray.600"
              borderRadius="md"
              h="50px"
              fontSize="md"
              _focus={{ borderColor: "#1a73e8" }}
              _placeholder={{ color: "gray.400" }}
            />
            <Text fontSize="sm" color="gray.400" mt={2}>
              We'll sign you in using your Gmail address.
            </Text>
          </Box>

          {/* Buttons */}
          <HStack justify="space-between" pt={4}>
            <Link
              color="#1a73e8"
              fontSize="sm"
              href="https://accounts.google.com/signup"
              isExternal
            >
              Create account
            </Link>
            <Button
  bg="#1a73e8"
  color="white"
  fontSize="14px"
  fontWeight="500"
  px={8}
  h="40px"
  rounded="full"
  _hover={{ bg: "#1765cc" }}
  _active={{ bg: "#1558b0" }}
  _focus={{ boxShadow: "0 0 0 2px #aecbfa" }}
  onClick={handleLogin}
>
  Continue
</Button>

          </HStack>
        </VStack>
      </Flex>

      {/* Footer */}
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        px={6}
        py={4}
        fontSize="sm"
        color="gray.400"
        borderTop="1px solid #3c4043"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 0 }}
      >
        <Select
          w="200px"
          bg="transparent"
          border="none"
          color="gray.400"
          fontSize="sm"
          textAlign="center"
          _focus={{ outline: "none" }}
        >
          <option style={{ color: "black" }}>English (United States)</option>
          <option style={{ color: "black" }}>Filipino</option>
          <option style={{ color: "black" }}>Español</option>
        </Select>

        <Stack direction="row" spacing={6}>
          <Link href="https://support.google.com/accounts" isExternal>
            Help
          </Link>
          <Link href="https://policies.google.com/privacy" isExternal>
            Privacy
          </Link>
          <Link href="https://policies.google.com/terms" isExternal>
            Terms
          </Link>
        </Stack>
      </Flex>
    </Flex>
  );
}
