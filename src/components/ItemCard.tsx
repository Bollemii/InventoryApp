import { StyleSheet, Text, View } from "react-native";

import { useSettingsContext } from "@/contexts/settingsContext";
import { useEditionModeContext } from "@/contexts/editionModeContext";
import PlusMinusButton from "./PlusMinusButton";
import EditItemModal from "./EditItemModal";
import { Item } from "@/model/Item";
import { Category } from "@/model/category";

interface ItemProps {
    item: Item;
    categoryName: string;
    handleChangeQuantity: (quantity: number) => void;
    handleEditItem: (item: Item, category: Category) => void;
    handleRemoveItem: () => void;
}

const SIZE = 110;

export default function ItemCard(props: ItemProps) {
    const { settingsCtx } = useSettingsContext();
    const { editionModeCtx } = useEditionModeContext();

    return (
        <View style={[styles.item, { backgroundColor: settingsCtx.theme.colors.items.background, height: editionModeCtx ? SIZE+10 : SIZE }]}>
            <Text style={styles.name}>{props.item.name}</Text>
            <View style={styles.quantityBox}>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(-1)}
                    plus={false}
                />
                <Text style={styles.quantity}>{props.item.quantity}</Text>
                <PlusMinusButton
                    onPress={() => props.handleChangeQuantity(1)}
                    plus={true}
                />
            </View>
            {editionModeCtx && (
                <EditItemModal
                    item={props.item}
                    categoryName={props.categoryName}
                    edit={props.handleEditItem}
                    remove={props.handleRemoveItem}
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
