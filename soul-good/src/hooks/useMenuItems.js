import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import menuItemsData from "../data/menuItems.json";

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("id", { ascending: true });

      if (error || !data || data.length === 0) {
        setMenuItems(menuItemsData);
      } else {
        setMenuItems(data);
      }
    } catch {
      setMenuItems(menuItemsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { menuItems, loading, refetch: fetchItems };
}
