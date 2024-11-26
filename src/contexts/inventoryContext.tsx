import { createContext, useContext, useEffect, useState } from "react";

import { Category } from "@/model/category";
import { Item } from "@/model/Item";
import * as ItemRepository from "@/dataaccess/itemRepository";
import * as CategoryRepository from "@/dataaccess/categoryRepository";

/**
 * The inventory context
 */
export const InventoryContext = createContext<{
    inventoryCtx: Category[];
    addCategory: (category: Category) => void;
    renameCategory: (categoryId: number, name: string) => void;
    removeCategory: (categoryId: number) => void;
    addItem: (categoryId: number, item: Item) => void;
    changeQuantityItem: (categoryId: number, itemId: number, add: number) => void;
    renameItem: (categoryId: number, itemId: number, name: string) => void;
    moveItem: (categoryId: number, itemId: number, newCategoryId: number) => void;
    removeItem: (categoryId: number, itemId: number) => void;
}>({
    inventoryCtx: [],
    addCategory: () => {},
    renameCategory: () => {},
    removeCategory: () => {},
    addItem: () => {},
    changeQuantityItem: () => {},
    renameItem: () => {},
    moveItem: () => {},
    removeItem: () => {},
});

/**
 * The inventory context provider
 *
 * @param children The children components
 * @returns The JSX element
 */
export default function InventoryContextProvider({ children }) {
    const [inventoryCtx, setInventoryCtx] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchAll() {
            let catItems = await ItemRepository.fetchAllItems();
            catItems.forEach((cat) => {
                sortArray(cat.items);
            });
            let catEmpty = await CategoryRepository.fetchAllCategories();
            catEmpty = catEmpty.filter((c) => !catItems.find((ci) => ci.id === c.id));
            catItems = catItems.concat(catEmpty);

            sortArray(catItems);
            setInventoryCtx(catItems);
        }
        fetchAll();
    }, []);

    // Internal functions
    const sortArray = (array: { name: string }[]) => {
        array.sort((a, b) => a.name.localeCompare(b.name));
    };
    const getCategory = (categoryId: number): Category => {
        return inventoryCtx.find((c) => c.id === categoryId);
    };
    const getCategoryIndex = (categoryId: number): number => {
        return inventoryCtx.findIndex((c) => c.id === categoryId);
    };
    const getItem = (categoryId: number, itemId: number): Item => {
        return inventoryCtx.find((c) => c.id === categoryId).items.find((i) => i.id === itemId);
    };
    const getItemIndex = (categoryId: number, itemId: number): number => {
        return inventoryCtx.find((c) => c.id === categoryId).items.findIndex((i) => i.id === itemId);
    };

    // External functions to manipulate the inventory
    const addCategory = (category: Category) => {
        const newInventory = [...inventoryCtx];
        newInventory.push(category);
        sortArray(newInventory);
        setInventoryCtx(newInventory);
    };
    const renameCategory = (categoryId: number, name: string) => {
        const newInventory = [...inventoryCtx];
        getCategory(categoryId).name = name;
        sortArray(newInventory);
        setInventoryCtx(newInventory);
    };
    const removeCategory = (categoryId: number) => {
        const newInventory = [...inventoryCtx];
        newInventory.splice(getCategoryIndex(categoryId), 1);
        setInventoryCtx(newInventory);
    };
    const addItem = (categoryId: number, item: Item) => {
        const newInventory = [...inventoryCtx];
        const category = getCategory(categoryId);
        category.items.push(item);
        sortArray(category.items);
        setInventoryCtx(newInventory);
    };
    const changeQuantityItem = (categoryId: number, itemId: number, add: number) => {
        const newInventory = [...inventoryCtx];
        getItem(categoryId, itemId).quantity += add;
        setInventoryCtx(newInventory);
    };
    const renameItem = (categoryId: number, itemId: number, name: string) => {
        const newInventory = [...inventoryCtx];
        getItem(categoryId, itemId).name = name;
        sortArray(getCategory(categoryId).items);
        setInventoryCtx(newInventory);
    };
    const moveItem = (categoryId: number, itemId: number, newCategoryId: number) => {
        const newInventory = [...inventoryCtx];
        const item = getItem(categoryId, itemId);
        const newCategory = getCategory(newCategoryId);
        newCategory.items.push(item);
        sortArray(newCategory.items);
        getCategory(categoryId).items.splice(getItemIndex(categoryId, itemId), 1);
        setInventoryCtx(newInventory);
    };
    const removeItem = (categoryId: number, itemId: number) => {
        const newInventory = [...inventoryCtx];
        getCategory(categoryId).items.splice(getItemIndex(categoryId, itemId), 1);
        setInventoryCtx(newInventory);
    };

    return (
        <InventoryContext.Provider
            value={{
                inventoryCtx,
                addCategory,
                renameCategory,
                removeCategory,
                addItem,
                changeQuantityItem,
                renameItem,
                moveItem,
                removeItem,
            }}
        >
            {children}
        </InventoryContext.Provider>
    );
}

/**
 * Hook to use the inventory context
 *
 * @returns The inventory context
 */
export function useInventoryContext() {
    return useContext(InventoryContext);
}
