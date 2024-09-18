import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faMinus, faPen, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

const ICONS = {
    "gear": faGear,
    "minus": faMinus,
    "pen": faPen,
    "plus": faPlus,
    "trash": faTrash,
    "xmark": faXmark,
};

interface IconProps {
    icon: keyof typeof ICONS;
    size: number;
    color?: string;
}

export default function Icon(props: IconProps) {
    if (!ICONS[props.icon]) {
        throw new Error("Icon not found");
    }

    return (
        <FontAwesomeIcon
            icon={ICONS[props.icon]}
            size={props.size}
            color={props.color || "black"}
        />
    );
}
