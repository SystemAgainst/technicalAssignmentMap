import { getColorByCost } from "./useGetColorByCost.ts";


export const getPlacemarkPreset = (isSelected: boolean, cost: number | null): string => {
    if (isSelected) {
        return "islands#blueIcon"; // Выбранная остановка
    }
    return getColorByCost(cost ?? -1);
};