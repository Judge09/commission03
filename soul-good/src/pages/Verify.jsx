import { useState } from "react";
import { VStack, Heading, Input, Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from "@emailjs/browser";

function maskEmail(email) {
  const [user, domain] = email.split("@");
  if (user.length <= 2) return "*@" + domain;
  return user[0] + "*".repeat(user.length - 2) + user.slice(-1) + "@" + domain;
}

export default function Verify() {
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("verificationEmail") || "";
  const maskedEmail = maskEmail(email);

  const handleVerify = async () => {
    setErrorMsg("");

    if (!code || code.length !== 6) {
      setErrorMsg("Enter the 6-digit code");
      return;
    }

    const { data, error } = await supabase
      .from("otps")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .limit(1)
      .single();

    if (error || !data) {
      setErrorMsg("Incorrect or expired OTP");
      return;
    }

    if (new Date() > new Date(data.expires_at)) {
      setErrorMsg("OTP expired. Please request a new code.");
      return;
    }

    // Mark OTP as used
    await supabase.from("otps").update({ used: true }).eq("id", data.id);

    // Add user to users table if not exists
    const { error: userError } = await supabase
      .from("users")
      .upsert({ email }, { onConflict: "email" });
    if (userError) console.error(userError);

    navigate("/menu");
  };

  const resendCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(new Date().getTime() + 15 * 60000);

    // Insert new OTP into Supabase
    const { error } = await supabase
      .from("otps")
      .insert({ email, code: newCode, expires_at: expiryTime.toISOString() });
    if (error) {
      console.error(error);
      setErrorMsg("Failed to resend code");
      return;
    }

    try {
      console.log("Resending EmailJS payload:", {
        email,
        passcode: newCode,
        time: expiryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      await emailjs.send(
        "service_pn1ecn9",       // replace
        "template_xqsd4l8",          // replace
        {
          email: email,          // matches {{email}} in template
          passcode: newCode,
          time: expiryTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        "B3qq_r0cNoHULpzEV"        // replace
      );

      alert(`Verification code resent to ${maskedEmail}`);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to resend code");
    }
  };

  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <VStack spacing={6} w="full" maxW="400px" p={10} bg="white" borderRadius="xl" boxShadow="lg">
        <Heading size="lg">Verify your email</Heading>
        <Text color="gray.600" fontSize="sm" textAlign="center">
          Enter the 6-digit code sent to <b>{maskedEmail}</b>
        </Text>

        <VStack spacing={4} w="full">
          <Input
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            onClick={handleVerify}
          >
            Verify
          </Button>
          <Button variant="link" colorScheme="brand" onClick={resendCode}>
            Resend code
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
}
