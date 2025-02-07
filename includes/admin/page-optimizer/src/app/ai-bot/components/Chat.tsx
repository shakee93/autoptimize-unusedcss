import { useChat } from "ai/react";

const aiRoot = window.rapidload_optimizer.ai_root || "https://ai.rapidload.io";

const Chat = () => {

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: `${aiRoot}/support`,
        streamProtocol: 'data',
        headers: {
            'Authorization': `Bearer f86e8df144f1469eacca8becd12a6e7f`
        },
        onError: (error) => {
            console.error(error);
        },
        onFinish: (message, options) => {
            console.log(message, options);
        },
        onResponse: (response) => {
            console.log(response);
        }
    });

    return (
        <div>
            <div>
                {isLoading && <div>Loading...</div>}
                {messages.map((message) => (
                    <div key={message.id}>{message.content}</div>
                ))}
            </div>
            <div>
                <input value={input} onChange={handleInputChange} />
                <button onClick={handleSubmit}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
