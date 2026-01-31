import { Center, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  useEffect(() => {
    // OTP flow removed — redirect users to login
    navigate('/login');
  }, []);
  return (
    <Center minH="50vh">
      <Text>OTP-based verification has been removed. Redirecting to Login...</Text>
    </Center>
  );
}


