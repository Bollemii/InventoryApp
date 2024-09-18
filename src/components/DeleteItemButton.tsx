import { StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import Icon from "./Icon";

interface DeleteItemButtonProps {
    onPress: () => void;
    style?: any;
}

const COLORS = {normal: "red", pressed: "darkred"}

export default function DeleteItemButton(props : DeleteItemButtonProps) {
    return (
        <Button onPress={props.onPress} style={[styles.button, props.style]} colors={COLORS}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Icon icon="trash" size={15} color="white"/>
                <Text style={{color: "white", marginLeft: 5}}>Remove</Text>
            </View>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
});
