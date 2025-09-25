import { useState } from "react";
import {
  VStack,
  Heading,
  Input,
  Button,
  Text,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Login() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    setErrorMsg("");
    if (!email.includes("@")) {
      setErrorMsg("Enter a valid email");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("verificationCode", code);
    localStorage.setItem("verificationEmail", email);

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        { to_email: email, code },
        "YOUR_PUBLIC_KEY"
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to send verification code");
      return;
    }

    navigate("/verify");
  };

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <VStack
        spacing={6}
        w="full"
        maxW="400px"
        p={10}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
      >
        <Heading size="lg">Sign in</Heading>
        <Text color="gray.600" fontSize="sm" textAlign="center">
          to continue to <b>Soul Good</b>
        </Text>

        <VStack spacing={4} w="full">
          <Input
            placeholder="Email or phone"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            borderRadius="full"
            boxShadow="sm"
            focusBorderColor="brand.500"
          />
          {errorMsg && (
            <Text color="red.500" fontSize="sm">
              {errorMsg}
            </Text>
          )}
          <Button
            colorScheme="brand"
            w="full"
            size="lg"
            borderRadius="full"
            onClick={handleNext}
          >
            Next
          </Button>
        </VStack>

        <Divider />
