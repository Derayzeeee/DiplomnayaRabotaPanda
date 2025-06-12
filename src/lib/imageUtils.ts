export const getOptimizedImageUrl = (url: string, width: number): string => {
    if (url.includes('?w=')) {
        return url;
    }

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=85`;
};

export const getProductImageSizes = {
    thumbnail: (url: string) => getOptimizedImageUrl(url, 200),
    small: (url: string) => getOptimizedImageUrl(url, 400),
    medium: (url: string) => getOptimizedImageUrl(url, 800),
    large: (url: string) => getOptimizedImageUrl(url, 1200)
};