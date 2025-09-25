import { useState } from "react";
import {
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Verify() {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("verificationEmail") || "";

  const handleVerify = () => {
    const storedCode = localStorage.getItem("verificationCode");
    if (code === storedCode) {
      navigate("/menu");
    } else {
      setErrorMsg("Incorrect verification code");
    }
  };

  const resendCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("verificationCode", newCode);

    // send code via EmailJS
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        { to_email: email, code: newCode },
        "YOUR_PUBLIC_KEY"
      );
      alert(`Verification code resent to ${email}`);
    } catch (err) {
      console.error(err);
      alert("Failed to resend code");
    }
  };

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <VStack
        spacing={6}
        w="full"
        maxW="400px"
        p={8}
        bg="white"
        borderRadius="md"
        boxShadow="md"
      >
        <Heading size="md">Verify your email</Heading>
        <Text color="gray.600" fontSize="sm" textAlign="center">
          Enter the 6-digit code sent to <b>{email}</b>
        </Text>

        <VStack spacing={4} w="full">
          <Input
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            size="lg"
            borderRadius="full"
            boxShadow="sm"
            focusBorderColor="blue.400"
          />
          {errorMsg && <Text color="red.500" fontSize="sm">{errorMsg}</Text>}
          <Button
            colorScheme="blue"
            w="full"
            size="lg"
            borderRadius="full"
            onClick={handleVerify}
          >
            Verify
          </Button>
          <Button variant="link" colorScheme="blue" onClick={resendCode}>
            Resend code
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
}
