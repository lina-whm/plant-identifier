import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { validateImageFile } from '../services/plantIdApi';

interface ImageUploaderProps {
    onImageSelect: (file: File) => void;
    isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isProcessing }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const processFile = useCallback((file: File) => {
        // сбрасываем ошибку
        setValidationError(null);
        
        // валидация файла
        const validation = validateImageFile(file);
        if (!validation.isValid) {
            setValidationError(validation.error || 'Некорректный файл');
            return;
        }
        
        // показываем превью
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        
        // отправляем файл родительскому компоненту
        onImageSelect(file);
    }, [onImageSelect]);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        } else {
            setValidationError('Пожалуйста, выберите изображение');
        }
    }, [processFile]);

    const handleRemoveImage = useCallback(() => {
        setPreview(null);
        setValidationError(null);
    }, []);

    const handleRetryUpload = useCallback(() => {
        const input = document.getElementById('file-input') as HTMLInputElement;
        if (input) {
            input.click();
        }
    }, []);

    return (
        <div className="uploader-container">
            <div
                className={`drop-zone ${preview ? 'has-preview' : ''} ${validationError ? 'has-error' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="preview-container">
                        <img src={preview} alt="Предпросмотр" className="image-preview" />
                        {!isProcessing && (
                            <button 
                                onClick={handleRemoveImage}
                                className="remove-button"
                                type="button"
                                aria-label="Удалить изображение"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <Upload size={48} />
                        <p>Перетащите сюда фото или нажмите для выбора</p>
                        <p className="upload-hint">
                            Поддерживаемые форматы: JPG, PNG, WEBP
                            <br />
                            Максимальный размер: 10MB
                        </p>
                    </div>
                )}
                
                <input
                    type="file"
                    id="file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="file-input"
                    aria-label="Выберите изображение растения"
                />
            </div>

            {validationError && (
                <div className="validation-error">
                    <AlertCircle size={20} />
                    <span>{validationError}</span>
                    <button 
                        onClick={handleRetryUpload}
                        className="button small secondary"
                        type="button"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            <div className="upload-buttons">
                <label 
                    htmlFor="file-input" 
                    className={`button ${isProcessing ? 'disabled' : ''}`}
                    tabIndex={0}
                    aria-disabled={isProcessing}
                >
                    <Upload size={20} />
                    {preview ? 'Выбрать другое фото' : 'Выбрать файл'}
                </label>
                
                {preview && !isProcessing && (
                    <button 
                        onClick={handleRemoveImage}
                        className="button secondary"
                        type="button"
                    >
                        Удалить
                    </button>
                )}
            </div>

            {isProcessing && (
                <div className="processing-notice">
                    <p>Обработка изображения...</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;