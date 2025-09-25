import { Flex, Box, Heading, Spacer, Button } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // redirect to login
  };

  return (
    <Flex
      as="nav"
      w="100%"
      p={4}
      bg="white"
      align="center"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Box>
        <Heading size="md" color="brand.500">
          Soul Good
        </Heading>
      </Box>
      <Spacer />
      <Button colorScheme="brand" onClick={handleLogout}>
        Logout
      </Button>
    </Flex>
  );
}
