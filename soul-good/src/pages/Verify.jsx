import {
  Box,
  Button,
  Center,
  Input,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Verify() {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    const { data: otp } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (otp) {
      const now = new Date();
      const expiry = new Date(otp.expires_at);
      if (now < expiry) {
        navigate("/menu");
      } else {
        alert("OTP expired!");
      }
    } else {
      alert("Invalid code!");
    }
  };

  const handleResend = async () => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    await supabase.from("otps").insert([
      { email, code: newCode, expires_at: expiresAt }
    ]);

    alert(`New OTP sent to ${email}`);
    setTimer(30);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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
            Verify your identity
          </Text>
          <Text fontSize="sm" color="gray.400">
            Enter the 6-digit code sent to {email}
          </Text>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            bg="#202124"
            borderColor="#5f6368"
            _focus={{ borderColor: "#1a73e8" }}
          />
          <Button
            bg="#1a73e8"
            color="white"
            _hover={{ bg: "#1765cc" }}
            onClick={handleVerify}
            isDisabled={code.length !== 6}
          >
            Verify
          </Button>
          <Button
            variant="ghost"
            color="#1a73e8"
            _hover={{ bg: "rgba(26,115,232,0.1)" }}
            onClick={handleResend}
            isDisabled={timer > 0}
          >
            {timer > 0 ? `Resend code (${timer}s)` : "Resend code"}
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
