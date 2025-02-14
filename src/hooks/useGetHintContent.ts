import { ICost, ISite } from "@/types";


export const getHintContent = (site: ISite, costInfo: ICost | undefined) => {
    if (!costInfo) {
        return `ID: ${site.site_id}, Название: ${site.site_name}`;
    }

    return `ID: ${site.site_id}, Название: ${site.site_name}<br>
            🕒 Затраты: ${costInfo.cost} мин.<br>
            ⏳ Ожидание: ${costInfo.iwait} мин.<br>
            🚌 Время в салоне: ${costInfo.inveht} мин.<br>
            🔄 Пересадки: ${costInfo.xnum}<br>
            ⚠️ Штраф: ${costInfo.xpen}`;
};