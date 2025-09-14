import { useState, type KeyboardEvent, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "bot";
  text: string;
};

// Компонент для форматирования сообщений бота
const FormattedMessage = ({ text }: { text: string }) => {
  const components = {
    a: ({ href, children }: ComponentProps<"a">) => {
      if (!href)
        return (
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

    // Контейнер для "каталога"
    ul: ({ children }: ComponentProps<"ul">) => (
      <div className="flex gap-4 p-2 flex-col">
        {children}
      </div>
    ),

    // Элемент каталога
    li: ({ children }: ComponentProps<"li">) => (
      <div className="w-full flex-shrink-0">
        {/* Горизонтальная прокрутка фото */}
        <div className="flex overflow-x-auto space-x-4 pb-2 snap-x snap-mandatory">
          <div className="w-[70vw] h-60 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 snap-center">
            Фото
          </div>
          <div className="w-[70vw] h-60 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 snap-center">
            Фото
          </div>
          <div className="w-[70vw] h-60 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-500 snap-center">
            Фото
          </div>
        </div>

        {/* Подпись и цена */}
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
      const res = await fetch("https://ebe596402a36.ngrok-free.app/ask", {
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
    <div className="max-w-xl mx-auto h-screen flex flex-col">
      <h1 className="text-2xl font-bold h-fit p-2 text-center">Qangybas AI</h1>

      <main className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && <div></div>}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-xl ${msg.role === "user"
              ? "bg-blue-100 text-right"
              : "bg-green-100 text-left"
              }`}
          >
            {/* <b>{msg.role === "user" ? "Вы" : "Бот"}:</b> */}
            {msg.role === "bot" ? (
              <FormattedMessage text={msg.text} />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {loading && <div className="text-gray-500 italic">Бот печатает...</div>}
      </main>

      <div className="flex gap-2 h-fit p-2">
        <input
          className="border rounded p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спросите о концертах..."
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "..." : "Отправить"}
        </button>
      </div>
    </div>
  );
}

export default App;
