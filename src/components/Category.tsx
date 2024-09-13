import { StyleSheet, Text, View } from "react-native";

import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import { Category as CategoryObj } from "@/model/category";
import { useSettingsContext } from "@/contexts/settingsContext";

interface CategoryProps {
    categoryIndex: number;
    category: CategoryObj;
    cardViewSetting: boolean;
    handleChangeQuantity: (
        categoryIndex: number,
        itemIndex: number,
        add: number
    ) => void;
}

export default function Category({
    categoryIndex,
    category,
    cardViewSetting,
    handleChangeQuantity,
}: CategoryProps) {
    const { settingsCtx } = useSettingsContext();

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
                <Text
                    style={[
                        styles.title,
                        { color: settingsCtx.theme.colors.texts },
                    ]}
                >
                    {category.name}
                </Text>
            </View>
            <View
                style={[
                    styles.items,
                    {
                        backgroundColor:
                            settingsCtx.theme.colors.items.background,
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
                        />
                    ) : (
                        <ItemList
                            key={item.id}
                            categoryIndex={categoryIndex}
                            itemIndex={index}
                            item={item}
                            handleChangeQuantity={handleChangeQuantity}
                        />
                    )
                )}
            </View>
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
