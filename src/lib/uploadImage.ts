export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
      const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      return data.url;
  } catch (error) {
      console.error('Ошибка загрузки:', error);
      throw new Error('Не удалось загрузить изображение');
  }
}