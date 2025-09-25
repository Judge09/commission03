import { VStack, Heading, Text } from "@chakra-ui/react";

export default function Menu() {
  return (
    <VStack h="100vh" justify="center" spacing={6}>
      <Heading>Menu</Heading>
      <Text>Welcome to Soul Good! Your menu items will appear here.</Text>
    </VStack>
  );
}
