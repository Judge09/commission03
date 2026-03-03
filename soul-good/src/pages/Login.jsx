import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  FormControl,
  FormLabel,
  Link,
  Text,
  VStack,
  Image,
  Select,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function FloatingLabelInput({ label, value, onChange, type = "text", rightElement }) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <FormControl position="relative" mb={5}>
      <InputGroup>
        <Input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          h="56px"
          pt={isFloated ? "18px" : "0"}
          pb="0"
          pl="14px"
          pr={rightElement ? "48px" : "14px"}
          bg="white"
          borderColor={focused ? "#1a73e8" : "#dadce0"}
          borderWidth={focused ? "2px" : "1px"}
          borderRadius="4px"
          fontSize="16px"
          color="#202124"
          _hover={{ borderColor: focused ? "#1a73e8" : "#202124" }}
          _focus={{ boxShadow: "none", borderColor: "#1a73e8", borderWidth: "2px" }}
        />
        {rightElement && (
          <InputRightElement h="56px" w="48px">
            {rightElement}
          </InputRightElement>
        )}
      </InputGroup>
      <FormLabel
        position="absolute"
        top={isFloated ? "8px" : "50%"}
        left="14px"
        transform={isFloated ? "translateY(0)" : "translateY(-50%)"}
        fontSize={isFloated ? "11px" : "16px"}
        color={focused ? "#1a73e8" : "#5f6368"}
        fontWeight="400"
        pointerEvents="none"
        transition="all 0.15s ease"
        zIndex={1}
        m={0}
        lineHeight="1"
        bg="white"
        px="1px"
      >
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async () => {
    if (!email) return alert("Please enter your Gmail address.");
    if (!email.toLowerCase().endsWith("@gmail.com")) return alert("Please use your Gmail address (example@gmail.com)");
    if (!password) return alert("Please enter your password.");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");

      const accessToken = data.accessToken || `temp_token_${data.user.id}`;
      const refreshToken = data.refreshToken || `temp_refresh_${data.user.id}`;

      login(accessToken, refreshToken, data.user);

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
      bg="#f1f3f4"
      justify="space-between"
      align="center"
      direction="column"
      fontFamily="'Google Sans', Roboto, Arial, sans-serif"
    >
      {/* Main content */}
      <Flex
        direction="column"
        w="100%"
        flex="1"
        justify="center"
        align="center"
        px={{ base: 4, sm: 0 }}
      >
        {/* Card */}
        <Box
          w="100%"
          maxW="450px"
          bg="white"
          border={{ base: "none", sm: "1px solid #dadce0" }}
          borderRadius={{ base: "0", sm: "8px" }}
          px={{ base: 6, sm: "48px" }}
          py={{ base: 8, sm: "48px" }}
        >
          <VStack align="stretch" spacing={0}>
            {/* Google logo */}
            <Image
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              boxSize="40px"
              mb={6}
            />

            {/* Heading */}
            <Text fontSize="24px" fontWeight="400" color="#202124" mb={2}>
              Sign in
            </Text>
            <Text fontSize="16px" color="#5f6368" mb={8}>
              to continue to Soul Good
            </Text>

            {/* Email field */}
            <FloatingLabelInput
              label="Email or phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />

            {/* Forgot email */}
            <Box mb={5} mt={-3}>
              <Link
                href="https://accounts.google.com/signin/recovery"
                isExternal
                color="#1a73e8"
                fontSize="14px"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                Forgot email?
              </Link>
            </Box>

            {/* Password field */}
            <FloatingLabelInput
              label="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              rightElement={
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  variant="ghost"
                  size="sm"
                  color="#5f6368"
                  _hover={{ bg: "transparent", color: "#202124" }}
                  _active={{ bg: "transparent" }}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                />
              }
            />

            {/* Forgot password */}
            <Box mb={8} mt={-3}>
              <Link
                href="https://accounts.google.com/signin/v2/challenge/pwd"
                isExternal
                color="#1a73e8"
                fontSize="14px"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Actions */}
            <HStack justify="space-between" align="center">
              <Link
                href="https://accounts.google.com/signup"
                isExternal
                color="#1a73e8"
                fontSize="14px"
                fontWeight="500"
                _hover={{ textDecoration: "underline" }}
              >
                Create account
              </Link>
              <Button
                bg="#1a73e8"
                color="white"
                fontSize="14px"
                fontWeight="500"
                px={6}
                h="36px"
                borderRadius="18px"
                _hover={{ bg: "#1765cc", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
                _active={{ bg: "#1558b0" }}
                _focus={{ boxShadow: "0 0 0 3px #aecbfa" }}
                onClick={handleLogin}
              >
                Next
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      {/* Footer */}
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        px={6}
        py={4}
        fontSize="12px"
        color="#70757a"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 0 }}
      >
        <Select
          w="fit-content"
          minW="180px"
          bg="transparent"
          border="none"
          color="#70757a"
          fontSize="12px"
          _focus={{ outline: "none", boxShadow: "none" }}
          iconColor="#70757a"
        >
          <option value="en">English (United States)</option>
          <option value="fil">Filipino</option>
          <option value="es">Español</option>
        </Select>

        <HStack spacing={6}>
          <Link
            href="https://support.google.com/accounts"
            isExternal
            color="#70757a"
            _hover={{ textDecoration: "underline" }}
          >
            Help
          </Link>
          <Link
            href="https://policies.google.com/privacy"
            isExternal
            color="#70757a"
            _hover={{ textDecoration: "underline" }}
          >
            Privacy
          </Link>
          <Link
            href="https://policies.google.com/terms"
            isExternal
            color="#70757a"
            _hover={{ textDecoration: "underline" }}
          >
            Terms
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
}
