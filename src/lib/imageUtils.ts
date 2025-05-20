export const getOptimizedImageUrl = (url: string, width: number): string => {
    // Если URL уже содержит параметры оптимизации, возвращаем его как есть
    if (url.includes('?w=')) {
        return url;
    }

    // Добавляем параметры оптимизации к URL
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=85`;
};

export const getProductImageSizes = {
    thumbnail: (url: string) => getOptimizedImageUrl(url, 200),
    small: (url: string) => getOptimizedImageUrl(url, 400),
    medium: (url: string) => getOptimizedImageUrl(url, 800),
    large: (url: string) => getOptimizedImageUrl(url, 1200)
};