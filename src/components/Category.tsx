import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import PlusMinusButton from "./PlusMinusButton";
import EditCategoryModal from "./EditCategoryModal";
import { Category as CategoryObj } from "@/model/category";
import { useEditionModeContext } from "@/contexts/editionModeContext";

interface CategoryProps {
    categoryIndex: number;
    category: CategoryObj;
    handleChangeQuantityItem: (categoryIndex: number, itemIndex: number, add: number) => void;
    handleRemoveItem: (categoryIndex: number, itemIndex: number) => void;
    handleEditCategory: (categoryIndex: number, category: CategoryObj) => void;
}

export default function Category(props: CategoryProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();
    const [collapsed, setCollapsed] = useState(false);

    const handleChangeQuantityItem = (itemIndex: number, add: number) => {
        props.handleChangeQuantityItem(props.categoryIndex, itemIndex, add);
    };
    const handleRemoveItem = (itemIndex: number) => {
        props.handleRemoveItem(props.categoryIndex, itemIndex);
    };
    const handleEditCategory = (category: CategoryObj) => {
        props.handleEditCategory(props.categoryIndex, category);
    };

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.category,
                    {
                        borderTopWidth: props.categoryIndex === 0 ? 1 : 0,
                    },
                ]}
            >
                <View style={styles.buttons}>
                    <PlusMinusButton
                        onPress={() => setCollapsed(!collapsed)}
                        plus={collapsed}
                        style={{ height: 25, width: 25, marginRight: 10 }}
                    />
                    {editionModeCtx && <EditCategoryModal category={props.category} save={handleEditCategory}/>}
                </View>
                <Text style={[styles.title, { color: settingsCtx.theme.colors.texts }]}>{props.category.name}</Text>
            </View>
            {!collapsed && (
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
                                itemIndex={index}
                                item={item}
                                handleChangeQuantity={handleChangeQuantityItem}
                                handleRemoveItem={handleRemoveItem}
                            />
                        ) : (
                            <ItemList
                                key={item.id}
                                itemIndex={index}
                                item={item}
                                handleChangeQuantity={handleChangeQuantityItem}
                                handleRemoveItem={handleRemoveItem}
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
        alignItems: "center",
        justifyContent: "center",
        padding: 5,
        borderBottomWidth: 1,
    },
    buttons: {
        position: "absolute",
        left: 10,
        flexDirection: "row",
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
