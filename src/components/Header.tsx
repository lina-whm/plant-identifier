import React from 'react';
import { Leaf } from 'lucide-react'; 

const Header: React.FC = () => {
    return (
        <header className="header">
            <Leaf className="header-icon" />
            <h1>Plant Identifier</h1>
            <p className="subtitle">Загрузите фото растения для распознавания</p>
        </header>
    );
};

export default Header;
