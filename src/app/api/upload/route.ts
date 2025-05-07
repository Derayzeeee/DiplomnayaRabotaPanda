import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Файл не предоставлен' },
                { status: 400 }
            );
        }

        // Конвертируем File в base64
        const bytes = await file.arrayBuffer();
        const base64File = Buffer.from(bytes).toString('base64');
        const dataURI = `data:${file.type};base64,${base64File}`;

        // Загружаем в Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'products',
        });

        return NextResponse.json({
            url: uploadResponse.secure_url
        });

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        return NextResponse.json(
            { error: 'Не удалось загрузить файл' },
            { status: 500 }
        );
    }
}