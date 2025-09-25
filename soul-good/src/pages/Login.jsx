import { useState } from "react";
import { VStack, Heading, Input, Button, Text, Flex, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { supabase } from "../supabaseClient";

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

    // Save email to localStorage for verification page
    localStorage.setItem("verificationEmail", email);

    // Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(new Date().getTime() + 15 * 60000); // 15 mins

    // Insert OTP into Supabase
    const { error } = await supabase
      .from("otps")
      .insert({ email, code, expires_at: expiryTime.toISOString() });
    if (error) {
      console.error(error);
      setErrorMsg("Failed to generate OTP");
      return;
    }

    // Send email via EmailJS
    try {
      console.log("Sending EmailJS payload:", {
        email,
        passcode: code,
        time: expiryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      await emailjs.send(
        "service_pn1ecn9",       // replace with your EmailJS service ID
        "template_xqsd4l8",          // replace with your template name
        {
          email: email,          // matches {{email}} in your template
          passcode: code,
          time: expiryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        "B3qq_r0cNoHULpzEV"       // replace with your EmailJS public key
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
      <VStack spacing={6} w="full" maxW="400px" p={10} bg="white" borderRadius="xl" boxShadow="lg">
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
        <Text fontSize="sm" color="gray.600">
          Not your device? Use Guest mode or{" "}
          <Button variant="link" colorScheme="brand">
            Create account
          </Button>
        </Text>
      </VStack>
    </Flex>
  );
}
