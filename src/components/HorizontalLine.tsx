import { View } from "react-native";

interface HorizontalLineProps {
    color?: string;
    width?: any;
}

/**
 * A horizontal line component
 * 
 * @param props The component props : {color, width}
 * @returns The JSX element
 */
export default function HorizontalLine(props: HorizontalLineProps) {
    return (
        <View style={{width: props.width || "100%", backgroundColor: props.color || "black", height: 1, marginVertical: 5}}/>
    );
}