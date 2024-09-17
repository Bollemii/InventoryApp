import { StyleSheet, Text, View } from "react-native";

import { Item } from "@/model/Item";
import PlusMinusButton from "./PlusMinusButton";
import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import DeleteItemButton from "./DeleteItemButton";

interface ItemProps {
    categoryIndex: number;
    itemIndex: number;
    item: Item;
    handleChangeQuantity: (categoryIndex: number, itemIndex: number, quantity: number) => void;
    handleRemoveItem: (categoryIndex: number, itemIndex: number) => void;
}

export default function ItemList({ categoryIndex, itemIndex, item, handleChangeQuantity, handleRemoveItem }: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background }]}>
            {editionModeCtx && (
                <DeleteItemButton
                    onPress={() => handleRemoveItem(categoryIndex, itemIndex)}
                    style={{ marginRight: 10 }}
                />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={() => handleChangeQuantity(categoryIndex, itemIndex, -1)}
                    plus={false}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
                <PlusMinusButton
                    onPress={() => handleChangeQuantity(categoryIndex, itemIndex, 1)}
                    plus={true}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        height: 50,
        width: "100%",
    },
    name: {
        flexGrow: 4,
        fontSize: 15,
    },
    quantityBox: {
        flexDirection: "row",
        width: "30%",
        alignItems: "center",
        justifyContent: "space-around",
    },
    quantity: {
        textAlign: "center",
        width: "20%",
        fontSize: 15,
    },
});
