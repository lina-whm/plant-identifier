import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isProcessing }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    return (
        <div className="uploader-container">
            <div
                className={`drop-zone ${preview ? 'has-preview' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {preview ? (
                    <img src={preview} alt="Предпросмотр" className="image-preview" />
                ) : (
                    <div className="upload-placeholder">
                        <Upload size={48} />
                        <p>Перетащите сюда фото или нажмите для выбора</p>
                    </div>
                )}
                <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="file-input"
                />
            </div>

            <div className="upload-buttons">
                <label htmlFor="file-input" className="button" tabIndex={0}>
                    <Upload size={20} />
                    Выбрать файл
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;