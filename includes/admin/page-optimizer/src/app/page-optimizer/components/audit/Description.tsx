
const Description = ({ content} : {content: string}) => {
    const parts = content.split(/\[(.*?)\]\((.*?)\)/);

    return (
        <p>
            {parts.map((part, index) => {
                if (index % 3 === 1) {
                    // Creating anchor tag for links
                    const link = parts[index + 1];
                    return (
                        <a className='text-purple-750/80' key={index} href={link} target="_blank" rel="noopener noreferrer">
                            {part}
                        </a>
                    );
                } else if (index % 3 === 0) {
                    // Displaying regular text
                    return <span key={index}>{part}</span>;
                } else {
                    return null;
                }
            })}
        </p>
    );
}

export default Description