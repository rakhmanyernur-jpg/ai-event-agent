import { useState, type KeyboardEvent, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "bot";
  text: string;
  photos?: string[];
};

// Компонент для форматирования сообщений бота
const FormattedMessage = ({ text, photos = [] }: { text: string; photos?: string[] }) => {
  const components = {
    a: ({ href }: ComponentProps<"a">) => {
      if (!href) return (
        <span className="text-gray-500 italic">[Ссылка отсутствует]</span>
      );

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mt-2 w-full">
            Купить
          </button>
        </a>
      );
    },
    p: ({ children }: ComponentProps<"p">) => (
      <div className="mb-2">{children}</div>
    ),
    ul: ({ children }: ComponentProps<"ul">) => (
      <div className="flex gap-4 p-2 flex-col">{children}</div>
    ),
    li: ({ children }: ComponentProps<"li">) => (
      <div className="w-full flex-shrink-0">
        {/* Фото с горизонтальной прокруткой */}
        {photos.length > 0 && (
          <div className="flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory">
            {photos.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Фото ${idx + 1}`}
                className="w-[50vw] h-60 object-cover rounded-lg flex-shrink-0 snap-center"
              />
            ))}
          </div>
        )}
        {/* Подпись/текст */}
        <div className="text-sm mt-2">{children}</div>
      </div>
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {text}
    </ReactMarkdown>
  );
};


function App() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // const res = await fetch("https://ebe596402a36.ngrok-free.app/ask", {
      const res = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      const botMessage: Message = {
        role: "bot",
        text: data.answer || "Нет ответа",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Ошибка при запросе" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="max-w-xl mx-auto h-screen flex flex-col bg-gray-50 font-sans">
      <h1 className="text-lg font-semibold h-fit p-3 text-center lowercase text-gray-800 tracking-tight">
        push {" "}
        <span className="inline-block relative overflow-hidden h-[1.5rem] align-middle">
          ~
        </span>
        <span className="inline-block relative overflow-hidden h-[1.5rem] align-middle">
          <span className="block whitespace-nowrap animate-slideWords">
            <span className="ml-1">estate</span> <br />
            auto<br />
            shop<br />
            <span className="ml-1">
              event
            </span>
          </span>
        </span>
      </h1>

      <main
        className={`flex-1 overflow-y-auto p-4 space-y-3 ${messages.length === 0 ? "flex items-center justify-center" : ""
          }`}
      >
        {messages.length === 0 && (
          <div className="text-gray-400 text-xl text-center italic">
            начните диалог...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-4 py-3 rounded-2xl shadow-sm w-fit max-w-[90%] text-sm leading-snug ${msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white border border-gray-200 text-gray-800 mr-auto"
              }`}
          >
            {msg.role === "bot" ? (
              <FormattedMessage text={msg.text} photos={msg.photos} />
            ) : (
              msg.text
            )}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-xs italic">бот печатает...</div>
        )}
      </main>


      <div className="flex gap-2 p-3 border-t border-gray-200 bg-white">
        <input
          className="border border-gray-300 rounded-xl px-4 py-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="спросите о концертах..."
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "..." : "отправить"}
        </button>
      </div>
    </div>

  );
}

export default App;
