import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import PlusMinusButton from "./PlusMinusButton";
import EditCategoryModal from "./EditCategoryModal";
import { Category as CategoryObj } from "@/model/category";

interface CategoryProps {
    categoryIndex: number;
    category: CategoryObj;
    cardViewSetting: boolean;
    handleChangeQuantity: (categoryIndex: number, itemIndex: number, add: number) => void;
    handleRemoveItem: (categoryIndex: number, itemIndex: number) => void;
}

export default function Category({ categoryIndex, category, cardViewSetting, handleChangeQuantity, handleRemoveItem }: CategoryProps) {
    const { settingsCtx } = useSettingsContext();
    const [ collapsed, setCollapsed ] = useState(false);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.category,
                    {
                        borderTopWidth: categoryIndex === 0 ? 1 : 0,
                    },
                ]}
            >
                <View style={styles.buttons}>
                    <PlusMinusButton
                        onPress={() => setCollapsed(!collapsed)}
                        plus={collapsed}
                        style={{ height: 25, width: 25, marginRight: 10 }}
                    />
                    <EditCategoryModal />
                </View>
                <Text style={[styles.title, { color: settingsCtx.theme.colors.texts }]}>{category.name}</Text>
            </View>
            {!collapsed && (
            <View
                style={[
                    styles.items,
                    {
                        backgroundColor: settingsCtx.theme.colors.items.background,
                        borderBottomWidth: cardViewSetting ? 1 : 0,
                    },
                ]}
            >
                {category.items.map((item, index) =>
                    cardViewSetting ? (
                        <ItemCard
                            key={item.id}
                            categoryIndex={categoryIndex}
                            itemIndex={index}
                            item={item}
                            handleChangeQuantity={handleChangeQuantity}
                            handleRemoveItem={handleRemoveItem}
                        />
                    ) : (
                        <ItemList
                            key={item.id}
                            categoryIndex={categoryIndex}
                            itemIndex={index}
                            item={item}
                            handleChangeQuantity={handleChangeQuantity}
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
