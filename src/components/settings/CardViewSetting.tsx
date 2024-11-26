import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import { switchColors } from "@/styles/colors";
import { useSettingsContext } from "@/contexts/settingsContext";
import { setCardViewSetting } from "@/dataaccess/settingsRepository";

interface CardViewSettingProps {
    style: any;
}

/**
 * A card view setting component : switch to enable/disable the cards view
 * 
 * @param props The component props : {style}
 * @returns The JSX element
 */
export default function CardViewSetting(props: CardViewSettingProps) {
    const { settingsCtx, setSettingsCtx } = useSettingsContext();
    const [cardsView, setCardsView] = useState(false);

    useEffect(() => {
        setCardsView(settingsCtx.cardsView);
    }, []);

    const handleCardsView = (value: boolean) => {
        setCardsView(value);
        setCardViewSetting(value);
        settingsCtx.cardsView = value;
        setSettingsCtx(settingsCtx);
    };

    return (
        <View
            style={props.style}
        >
            <Text style={[styles.itemText, { color: settingsCtx.theme.colors.texts }]}>Cards view</Text>
            <Switch
                trackColor={switchColors.track}
                thumbColor={cardsView ? switchColors.thumb.true : switchColors.thumb.false}
                onValueChange={handleCardsView}
                value={cardsView}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    itemText: {
        fontSize: 16,
    },
});
