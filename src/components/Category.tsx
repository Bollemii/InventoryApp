import { StyleSheet, Text, View } from "react-native";

import ItemCard from "./ItemCard";
import ItemList from "./ItemList";
import { Category as CategoryObj } from "@/model/category";
import { useEffect, useState } from "react";
import { getThemeSetting } from "@/dataaccess/settingsRepository";
import { colorScheme } from "@/styles/colors";

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
    const [theme, setTheme] = useState(colorScheme.dark);

    useEffect(() => {
        getThemeSetting().then((theme) => { setTheme(theme) });
    }, []);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.category,
                    {
                        borderTopWidth:
                            cardViewSetting || categoryIndex === 0 ? 1 : 0,
                    },
                ]}
            >
                <Text style={[styles.title, {color: theme.colors.texts}]}>{category.name}</Text>
            </View>
            <View style={[styles.items, {backgroundColor: theme.colors.items.background}]}>
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
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
});
