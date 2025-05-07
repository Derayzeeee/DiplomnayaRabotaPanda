export const getOptimizedImageUrl = (url: string, width: number = 500) => {
    if (!url) return '';
    
    // Проверяем, является ли URL cloudinary
    if (url.includes('res.cloudinary.com')) {
        // Добавляем параметры трансформации
        return url.replace('/upload/', `/upload/w_${width},c_scale,q_auto,f_auto/`);
    }
    
    return url;
};

export const getProductImageSizes = {
    thumbnail: (url: string) => getOptimizedImageUrl(url, 200),
    medium: (url: string) => getOptimizedImageUrl(url, 500),
    large: (url: string) => getOptimizedImageUrl(url, 1000)
};