import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  Textarea,
  Heading,
  Image,
  Badge,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  InputGroup,
  InputRightElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { supabase } from "../supabaseClient";
import { useRef } from "react";

const ADMIN_PASSWORD = "SoulGood@admin2024";

// ─── Tag chip input ──────────────────────────────────────────────────────────
function TagInput({ value = [], onChange, placeholder }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
  };

  return (
    <Box>
      <Wrap mb={2}>
        {value.map((tag) => (
          <WrapItem key={tag}>
            <Tag colorScheme="orange" borderRadius="full">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => onChange(value.filter((t) => t !== tag))} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
      <InputGroup size="sm">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
        />
        <InputRightElement width="4rem">
          <Button h="1.4rem" size="xs" onClick={addTag}>Add</Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}

// ─── Item form fields (shared by Edit + Add) ─────────────────────────────────
function ItemForm({ form, setForm, categories }) {
  return (
    <VStack spacing={4} align="stretch">
      {form.image && (
        <Box textAlign="center">
          <Image
            src={form.image}
            alt={form.name}
            maxH="180px"
            objectFit="cover"
            borderRadius="md"
            mx="auto"
            fallbackSrc="/default-food.jpg"
          />
        </Box>
      )}

      <FormControl>
        <FormLabel fontSize="sm">Image Path / URL</FormLabel>
        <Input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="/1.png or https://..."
          size="sm"
        />
        <Text fontSize="xs" color="gray.500" mt={1}>
          Use /1.png for images in /public, or paste a full URL
        </Text>
      </FormControl>

      <HStack spacing={3}>
        <FormControl flex={2}>
          <FormLabel fontSize="sm">Name</FormLabel>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            size="sm"
          />
        </FormControl>
        <FormControl flex={1}>
          <FormLabel fontSize="sm">Price (₱)</FormLabel>
          <NumberInput value={form.price} onChange={(val) => setForm({ ...form, price: val })} min={0} size="sm">
            <NumberInputField />
          </NumberInput>
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel fontSize="sm">Category</FormLabel>
        <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} size="sm">
          {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Description</FormLabel>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} size="sm" rows={2} />
      </FormControl>

      <HStack spacing={3}>
        <FormControl>
          <FormLabel fontSize="sm">Calories</FormLabel>
          <Input value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="220 kcal" size="sm" />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Protein</FormLabel>
          <Input value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} placeholder="5 g" size="sm" />
        </FormControl>
      </HStack>

      <FormControl>
        <FormLabel fontSize="sm">Tags</FormLabel>
        <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} placeholder="e.g. Vegan, Smoothie" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Allergens</FormLabel>
        <TagInput value={form.allergens} onChange={(allergens) => setForm({ ...form, allergens })} placeholder="e.g. Dairy, Gluten" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Availability</FormLabel>
        <Select
          value={form.is_available ? "true" : "false"}
          onChange={(e) => setForm({ ...form, is_available: e.target.value === "true" })}
          size="sm"
        >
          <option value="true">Available (visible to customers)</option>
          <option value="false">Hidden from menu</option>
        </Select>
      </FormControl>
    </VStack>
  );
}

// ─── Edit item modal ──────────────────────────────────────────────────────────
function EditItemModal({ item, categories, isOpen, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        category: item.category || (categories[0]?.name ?? ""),
        description: item.description || "",
        price: item.price || 0,
        image: item.image || "",
        calories: item.calories || "",
        protein: item.protein || "",
        tags: item.tags || [],
        allergens: item.allergens || [],
        is_available: item.is_available !== false,
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: "Name and price are required", status: "error", duration: 2000, position: "top" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("menu_items")
        .update({ ...form, price: parseInt(form.price), name: form.name.trim(), description: form.description.trim(), image: form.image.trim(), calories: form.calories.trim(), protein: form.protein.trim(), updated_at: new Date().toISOString() })
        .eq("id", item.id);
      if (error) throw error;
      toast({ title: "Saved!", status: "success", duration: 1800, position: "top" });
      onSaved();
      onClose();
    } catch (err) {
      toast({ title: "Failed to save", description: err.message, status: "error", duration: 3000, position: "top" });
    } finally {
      setSaving(false);
    }
  };

  if (!form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="var(--font-the-seasons)">Edit: {item?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ItemForm form={form} setForm={setForm} categories={categories} />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme="orange" onClick={handleSave} isLoading={saving}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Add item modal ───────────────────────────────────────────────────────────
function AddItemModal({ categories, isOpen, onClose, onSaved }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const blankForm = () => ({
    name: "", category: categories[0]?.name ?? "", description: "", price: "",
    image: "", calories: "", protein: "", tags: [], allergens: [], is_available: true,
  });
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (isOpen) setForm(blankForm());
  }, [isOpen, categories]);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: "Name and price are required", status: "error", duration: 2000, position: "top" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("menu_items").insert({
        ...form, price: parseInt(form.price), name: form.name.trim(),
        description: form.description.trim(), image: form.image.trim(),
        calories: form.calories.trim(), protein: form.protein.trim(),
      });
      if (error) throw error;
      toast({ title: "Item added!", status: "success", duration: 1800, position: "top" });
      onSaved();
      onClose();
    } catch (err) {
      toast({ title: "Failed to add", description: err.message, status: "error", duration: 3000, position: "top" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="var(--font-the-seasons)">Add New Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ItemForm form={form} setForm={setForm} categories={categories} />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={3}>Cancel</Button>
          <Button colorScheme="orange" onClick={handleAdd} isLoading={saving}>Add Item</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ─── Categories tab ───────────────────────────────────────────────────────────
function CategoriesPanel({ categories, onRefresh }) {
  const toast = useToast();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const cancelRef = useRef();

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: "Category already exists", status: "warning", duration: 2000, position: "top" });
      return;
    }
    setAdding(true);
    try {
      const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0);
      const { error } = await supabase.from("categories").insert({ name: trimmed, sort_order: maxOrder + 1 });
      if (error) throw error;
      toast({ title: "Category added", status: "success", duration: 1800, position: "top" });
      setNewName("");
      onRefresh();
    } catch (err) {
      toast({ title: "Failed", description: err.message, status: "error", duration: 3000, position: "top" });
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleRename = async (cat) => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === cat.name) { setEditingId(null); return; }
    setSavingId(cat.id);
    try {
      // Rename in categories table
      const { error: catErr } = await supabase.from("categories").update({ name: trimmed }).eq("id", cat.id);
      if (catErr) throw catErr;
      // Rename all menu_items with this category
      const { error: itemErr } = await supabase.from("menu_items").update({ category: trimmed }).eq("category", cat.name);
      if (itemErr) throw itemErr;
      toast({ title: "Category renamed", status: "success", duration: 1800, position: "top" });
      setEditingId(null);
      onRefresh();
    } catch (err) {
      toast({ title: "Failed", description: err.message, status: "error", duration: 3000, position: "top" });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      // Move items in this category to first remaining category or leave as-is
      const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      toast({ title: "Category deleted", description: "Items in this category still exist but are now uncategorized.", status: "success", duration: 3000, position: "top" });
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      toast({ title: "Failed", description: err.message, status: "error", duration: 3000, position: "top" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* Add new category */}
      <Box bg="white" borderRadius="xl" boxShadow="sm" p={4} mb={4}>
        <Text fontWeight="600" fontSize="sm" mb={3}>Add New Category</Text>
        <HStack>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            size="sm"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button colorScheme="orange" size="sm" leftIcon={<AddIcon />} onClick={handleAdd} isLoading={adding} flexShrink={0}>
            Add
          </Button>
        </HStack>
      </Box>

      {/* Category list */}
      <Box bg="white" borderRadius="xl" boxShadow="sm" overflowX="auto">
        <Table size="sm" variant="simple">
          <Thead bg="orange.50">
            <Tr>
              <Th>Category Name</Th>
              <Th isNumeric>Items</Th>
              <Th w="120px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((cat) => (
              <Tr key={cat.id} _hover={{ bg: "orange.50" }}>
                <Td>
                  {editingId === cat.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      size="sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(cat);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <Text fontSize="sm" fontWeight="500">{cat.name}</Text>
                  )}
                </Td>
                <Td isNumeric>
                  <Badge colorScheme="orange" borderRadius="full">{cat.itemCount ?? "—"}</Badge>
                </Td>
                <Td>
                  <HStack spacing={1} justify="flex-end">
                    {editingId === cat.id ? (
                      <>
                        <Button size="xs" colorScheme="orange" isLoading={savingId === cat.id} onClick={() => handleRename(cat)}>Save</Button>
                        <Button size="xs" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <IconButton aria-label="rename" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="orange" onClick={() => startEdit(cat)} />
                        <IconButton aria-label="delete" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => setDeleteTarget(cat)} />
                      </>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Delete confirm */}
      <AlertDialog isOpen={!!deleteTarget} leastDestructiveRef={cancelRef} onClose={() => setDeleteTarget(null)} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="md">Delete "{deleteTarget?.name}"?</AlertDialogHeader>
          <AlertDialogBody fontSize="sm">
            The category will be removed. Items assigned to it will remain but won't appear in any category filter until reassigned.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setDeleteTarget(null)} variant="ghost" size="sm">Cancel</Button>
            <Button colorScheme="red" onClick={handleDelete} isLoading={deleting} ml={3} size="sm">Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}

// ─── Menu items tab ───────────────────────────────────────────────────────────
function MenuItemsPanel({ categories, items, loadingItems, onRefresh }) {
  const [filterCat, setFilterCat] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const editModal = useDisclosure();
  const addModal = useDisclosure();

  const handleEdit = (item) => {
    setSelectedItem(item);
    editModal.onOpen();
  };

  const filteredItems = filterCat === "All" ? items : items.filter((i) => i.category === filterCat);

  return (
    <Box>
      <HStack mb={4} spacing={3} justify="space-between">
        <HStack spacing={3}>
          <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} w="220px" size="sm" bg="white">
            <option value="All">All Categories</option>
            {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </Select>
          <Text fontSize="sm" color="gray.500">{filteredItems.length} items</Text>
        </HStack>
        <Button leftIcon={<AddIcon />} colorScheme="orange" size="sm" onClick={addModal.onOpen}>
          Add Item
        </Button>
      </HStack>

      {loadingItems ? (
        <Center py={12}><Spinner color="orange.500" size="lg" /></Center>
      ) : (
        <Box overflowX="auto" bg="white" borderRadius="xl" boxShadow="sm">
          <Table size="sm" variant="simple">
            <Thead bg="orange.50">
              <Tr>
                <Th w="70px">Image</Th>
                <Th>Name</Th>
                <Th display={{ base: "none", md: "table-cell" }}>Category</Th>
                <Th>Price</Th>
                <Th display={{ base: "none", md: "table-cell" }}>Status</Th>
                <Th w="60px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredItems.map((item) => (
                <Tr key={item.id} opacity={item.is_available === false ? 0.5 : 1} _hover={{ bg: "orange.50" }}>
                  <Td>
                    <Image src={item.image} alt={item.name} boxSize="48px" objectFit="cover" borderRadius="md" fallbackSrc="/default-food.jpg" />
                  </Td>
                  <Td>
                    <Text fontWeight="500" fontSize="sm" noOfLines={1}>{item.name}</Text>
                    <Text fontSize="xs" color="gray.400" noOfLines={1} display={{ base: "block", md: "none" }}>{item.category}</Text>
                  </Td>
                  <Td display={{ base: "none", md: "table-cell" }}>
                    <Text fontSize="sm" color="gray.600">{item.category}</Text>
                  </Td>
                  <Td><Text fontSize="sm" fontWeight="600">₱{item.price}</Text></Td>
                  <Td display={{ base: "none", md: "table-cell" }}>
                    <Badge colorScheme={item.is_available !== false ? "green" : "gray"} borderRadius="full" fontSize="xs">
                      {item.is_available !== false ? "Live" : "Hidden"}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton aria-label="edit" icon={<EditIcon />} size="sm" variant="ghost" colorScheme="orange" onClick={() => handleEdit(item)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <EditItemModal item={selectedItem} categories={categories} isOpen={editModal.isOpen} onClose={editModal.onClose} onSaved={onRefresh} />
      <AddItemModal categories={categories} isOpen={addModal.isOpen} onClose={addModal.onClose} onSaved={onRefresh} />
    </Box>
  );
}

// ─── Main Admin page ──────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const toast = useToast();

  const loadAll = async () => {
    setLoadingItems(true);
    const [{ data: cats }, { data: menuData }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("menu_items").select("*").order("id", { ascending: true }),
    ]);

    const itemList = menuData || [];
    const catList = (cats || []).map((cat) => ({
      ...cat,
      itemCount: itemList.filter((i) => i.category === cat.name).length,
    }));

    setCategories(catList);
    setItems(itemList);
    setLoadingItems(false);
  };

  const handleLogin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
      loadAll();
    } else {
      setPwError(true);
    }
  };

  if (!authed) {
    return (
      <Center minH="100vh" bg="orange.50">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" w="320px">
          <VStack spacing={4}>
            <Heading size="md" color="orange.600" fontFamily="var(--font-recoleta)">Admin Access</Heading>
            <Text fontSize="sm" color="gray.500">Soul Good Cafe</Text>
            <FormControl>
              <Input
                type="password"
                placeholder="Password"
                value={pwInput}
                onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                isInvalid={pwError}
                borderColor={pwError ? "red.400" : undefined}
              />
              {pwError && <Text color="red.400" fontSize="xs" mt={1}>Incorrect password</Text>}
            </FormControl>
            <Button colorScheme="orange" w="full" onClick={handleLogin}>Enter</Button>
          </VStack>
        </Box>
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <HStack px={6} py={3} bg="white" boxShadow="sm" justify="space-between">
        <Heading size="md" color="orange.600" fontFamily="var(--font-recoleta)">Soul Good — Admin</Heading>
        <Button variant="ghost" size="sm" onClick={() => { setAuthed(false); setPwInput(""); }}>Lock</Button>
      </HStack>

      <Box px={6} py={4}>
        <Tabs colorScheme="orange" variant="soft-rounded">
          <TabList mb={4}>
            <Tab fontSize="sm">Menu Items</Tab>
            <Tab fontSize="sm">Categories</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <MenuItemsPanel
                categories={categories}
                items={items}
                loadingItems={loadingItems}
                onRefresh={loadAll}
              />
            </TabPanel>
            <TabPanel px={0}>
              <CategoriesPanel categories={categories} onRefresh={loadAll} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
