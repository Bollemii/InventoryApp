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

const SIZE = 110;

export default function ItemCard({ categoryIndex, itemIndex, item, handleChangeQuantity, handleRemoveItem }: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background, height: editionModeCtx ? SIZE+10 : SIZE }]}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={false}
                    categoryIndex={categoryIndex}
                    itemIndex={itemIndex}
                />
                <Text style={styles.quantity}>{item.quantity}</Text>
                <PlusMinusButton
                    onPress={handleChangeQuantity}
                    plus={true}
                    categoryIndex={categoryIndex}
                    itemIndex={itemIndex}
                />
            </View>
            {editionModeCtx && (
                <DeleteItemButton
                    onPress={() => handleRemoveItem(categoryIndex, itemIndex)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 7,
        marginVertical: 5,
        height: SIZE,
        width: SIZE,
    },
    name: {
        width: "100%",
        flexGrow: 1,
        textAlign: "center",
        fontSize: 15,
        marginTop: 5,
    },
    quantityBox: {
        flexDirection: "row",
        width: "100%",
        flexGrow: 2,
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 5,
    },
    quantity: {
        width: "40%",
        textAlign: "center",
        fontSize: 15,
    },
});
