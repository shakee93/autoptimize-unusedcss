import React from 'react';

interface ShrinkStringProps {
    text: string;
}

const ShrinkString: React.FC<ShrinkStringProps> = ({ text }) => {
    const shrinkedText = () => {
        if (text.length <= 40) {
            return text;
        } else {
            const start = text.slice(0, 20);
            const end = text.slice(-20);
            return `${start}...${end}`;
        }
    };

    return (
        <div>
            <p>{shrinkedText()}</p>
        </div>
    );
};

export default ShrinkString;
