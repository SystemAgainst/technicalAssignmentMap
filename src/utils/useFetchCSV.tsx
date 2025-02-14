import { useEffect, useState } from "react";
import { parse } from "papaparse";


export function useFetchCSV<T>(url: string, transformData: (data: any) => T[]) {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки файла: ${url}`);
                }

                const csvText = await response.text();
                const parsedData = parse(csvText, { header: true, skipEmptyLines: true, delimiter: ";" });

                setData(transformData(parsedData.data)); // Обрабатываем данные через переданную функцию
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, error, };
}