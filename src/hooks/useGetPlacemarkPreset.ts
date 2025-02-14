import { getColorByCost } from "./useGetColorByCost.ts";


export const getPlacemarkPreset = (isSelected: null | boolean, cost: number | undefined): string => {
    if (isSelected) {
        return "islands#blueIcon"; // Выбранная остановка
    }
    return getColorByCost(cost ?? -1);
};