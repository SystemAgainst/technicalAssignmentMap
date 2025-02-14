import { useEffect, useState } from "react";


export function useSkeletonLoading(isSiteLoading: boolean, isCostDataLoading: boolean) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const skeletonTimer = setTimeout(() => {
            if (!isSiteLoading && !isCostDataLoading) {
                setIsLoading(false);
            }
        }, 3000);

        return () => {
            clearTimeout(skeletonTimer);
        };
    }, [isSiteLoading, isCostDataLoading]);

    return isLoading;
}
