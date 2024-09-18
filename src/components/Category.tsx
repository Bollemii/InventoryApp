import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import PlusMinusButton from "./PlusMinusButton";
import EditCategoryModal from "./EditCategoryModal";
import { Category as CategoryObj } from "@/model/category";
import { Item } from "@/model/Item";

interface CategoryProps {
    categoryIndex: number;
    category: CategoryObj;
    handleChangeQuantityItem: (categoryIndex: number, itemIndex: number, add: number) => void;
    handleEditItem: (categoryIndex: number, itemIndex: number, item: Item, category: CategoryObj) => void;
    handleRemoveItem: (categoryIndex: number, itemIndex: number) => void;
    handleEditCategory: (categoryIndex: number, category: CategoryObj) => void;
    handleRemoveCategory: (categoryIndex: number) => void;
}

export default function Category(props: CategoryProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.category,
                    {
                        borderTopWidth: props.categoryIndex === 0 && props.category.items.length > 0 ? 1 : 0,
                    },
                ]}
            >
                {editionModeCtx && (
                    <EditCategoryModal
                        category={props.category}
                        edit={(category) => props.handleEditCategory(props.categoryIndex, category)}
                        remove={() => props.handleRemoveCategory(props.categoryIndex)}
                    />
                )}
                <Text style={[styles.title, { color: settingsCtx.theme.colors.texts }]}>{props.category.name}</Text>
                {props.category.items.length > 0 && (
                    <PlusMinusButton
                        onPress={() => setCollapsed(!collapsed)}
                        plus={collapsed}
                        style={styles.collapseButton}
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
                            <ItemCard
                                key={item.id}
                                item={item}
                                categoryName={props.category.name}
                                handleChangeQuantity={(add) => props.handleChangeQuantityItem(props.categoryIndex, index, add)}
                                handleEditItem={(item, category) => props.handleEditItem(props.categoryIndex, index, item, category)}
                                handleRemoveItem={() => props.handleRemoveItem(props.categoryIndex, index)}
                            />
                        ) : (
                            <ItemList
                                key={item.id}
                                item={item}
                                categoryName={props.category.name}
                                handleChangeQuantity={(add) => props.handleChangeQuantityItem(props.categoryIndex, index, add)}
                                handleEditItem={(item, category) => props.handleEditItem(props.categoryIndex, index, item, category)}
                                handleRemoveItem={() => props.handleRemoveItem(props.categoryIndex, index)}
                            />
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
