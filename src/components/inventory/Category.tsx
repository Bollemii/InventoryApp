import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import { useInventoryContext } from "@/contexts/inventoryContext";
import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import PlusMinusButton from "../PlusMinusButton";
import EditCategoryModal from "./EditCategoryModal";
import { Category as CategoryObj } from "@/model/category";
import * as CategoryRepository from "@/dataaccess/categoryRepository";
import { collapseCategory, isCategoryCollapsed } from "@/dataaccess/settingsRepository";

interface CategoryProps {
    categoryIndex: number;
    category: CategoryObj;
}

/**
 * A category component that displays a category and its items
 *
 * @param props The component props : {categoryIndex, category}
 * @returns The JSX element
 */
export default function Category(props: CategoryProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();
    const { renameCategory, removeCategory } = useInventoryContext();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        isCategoryCollapsed(props.category.id).then((isCollapsed) => setCollapsed(isCollapsed));
    }, [props.category.name]);

    const handleRenameCategory = async (name: string) => {
        if (!CategoryObj.isNameValid(name)) {
            throw new Error("Category name is required");
        }

        const fetchedCategory = await CategoryRepository.fetchCategoryByName(name.trim());
        if (fetchedCategory) {
            throw new Error("This category already exists");
        }

        await CategoryRepository.editCategoryName(props.category.id, name.trim());
        renameCategory(props.category.id, name);
    };
    const handleRemoveCategory = async () => {
        if (props.category.items.length > 0) {
            throw new Error("Category is not empty");
        }

        await CategoryRepository.deleteCategory(props.category.id);

        removeCategory(props.category.id);
    };
    const handleCollapseCategory = async () => {
        setCollapsed(!collapsed);
        collapseCategory(props.category.id);
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.category,
                    {
                        borderTopWidth: props.categoryIndex === 0 && props.category.items.length > 0 ? 1 : 0,
                        backgroundColor: settingsCtx.theme.colors.background,
                    },
                ]}
            >
                {editionModeCtx && (
                    <EditCategoryModal
                        category={props.category}
                        edit={handleRenameCategory}
                        remove={handleRemoveCategory}
                    />
                )}
                <Text style={[styles.title, { color: settingsCtx.theme.colors.texts }]}>{props.category.name}</Text>
                {props.category.items.length > 0 && (
                    <PlusMinusButton
                        onPress={handleCollapseCategory}
                        plus={collapsed}
                        style={{ ...styles.collapseButton, backgroundColor: settingsCtx.theme.colors.background }}
                    />
                )}
            </View>
            {!collapsed && props.category.items.length > 0 && (
                <View
                    style={[
                        styles.items,
                        {
                            backgroundColor: settingsCtx.theme.colors.items.background,
                            borderBottomWidth: settingsCtx.cardsView ? 1 : 0,
                        },
                    ]}
                >
                    {props.category.items.map((item, index) =>
                        settingsCtx.cardsView ? (
                            <ItemCard key={item.id} item={item} category={props.category} />
                        ) : (
                            <ItemList key={item.id} item={item} category={props.category} />
                        )
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    category: {
        width: "100%",
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderBottomWidth: 1,
    },
    collapseButton: {
        height: 25,
        width: 25,
        marginRight: 10,
        position: "absolute",
        right: 5,
    },
    title: {
        fontSize: 17,
        fontWeight: "bold",
    },
    items: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
});
