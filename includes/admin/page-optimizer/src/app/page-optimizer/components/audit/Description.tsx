import {cn} from "lib/utils";

const Description = ({ content, className} : {content?: string, className?: string}) => {
    const parts = content?.split(/\[(.*?)\]\((.*?)\)/);

    return (
        <div className={cn(
            'text-sm py-0 px-2',
            className
        )}>
            {parts?.map((part, index) => {
                if (index % 3 === 1) {
                    // Creating anchor tag for links
                    const link = parts[index + 1];
                    return (
                        <a className='text-purple-750/80 dark:text-brand-500' key={index} href={link} target="_blank" rel="noopener noreferrer">
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
        </div>
    );
}

export default Description