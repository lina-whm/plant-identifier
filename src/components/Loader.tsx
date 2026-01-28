import React from 'react';
import './Loader.css'; 

const Loader: React.FC = () => {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p>Анализируем растение...</p>
        </div>
    );
};

export default Loader;