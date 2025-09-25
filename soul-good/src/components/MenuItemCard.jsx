import { Box, Image, Heading, Text, Badge, VStack } from "@chakra-ui/react";

export default function MenuItemCard({ item }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      shadow="sm"
      _hover={{ shadow: "md" }}
    >
      <Image src={item.image} alt={item.name} objectFit="cover" w="100%" h="200px" />
      <VStack spacing={2} align="start" p={4}>
        <Heading size="md">{item.name}</Heading>
        <Text fontSize="sm" color="gray.600">{item.ingredients}</Text>
        <Text fontWeight="bold">₱{item.price}</Text>
        {item.allergens && <Badge colorScheme="red">{item.allergens}</Badge>}
      </VStack>
    </Box>
  );
}
