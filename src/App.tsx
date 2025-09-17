import { useState, type KeyboardEvent, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FlatCard from "./components/FlatCard";

type Message = {
  role: "user" | "bot";
  text: string;
  flats?: {
    title?: string;
    district?: string;
    street?: string;
    price?: string;
    infrastructure?: string;
    mortgageProgram?: string;
    downPayment?: string;
    contactLink?: string;
    photos?: string[];
  }[];
};

const FormattedMessage = ({
  text,
  flats = [],
}: {
  text: string;
  flats?: Message["flats"];
}) => {
  console.log("flats: ", flats)
  const components = {
    a: ({ href, children }: ComponentProps<"a">) =>
      href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mt-2 w-full">
            {children || "Перейти"}
          </button>
        </a>
      ) : (
        <span className="text-gray-500 italic">[Ссылка отсутствует]</span>
      ),
    p: ({ children }: ComponentProps<"p">) => (
      <div className="mb-2">{children}</div>
    ),
    ul: ({ children }: ComponentProps<"ul">) => (
      <ul className="list-disc list-inside space-y-1">{children}</ul>
    ),
    li: ({ children }: ComponentProps<"li">) => (
      <li className="text-sm">{children}</li>
    ),
    table: ({ children }: ComponentProps<"table">) => (
      <table className="border border-gray-300 text-sm w-full my-2">{children}</table>
    ),
    th: ({ children }: ComponentProps<"th">) => (
      <th className="border border-gray-300 px-2 py-1 bg-gray-100">{children}</th>
    ),
    td: ({ children }: ComponentProps<"td">) => (
      <td className="border border-gray-300 px-2 py-1">{children}</td>
    ),
  };

  return (
    <div className="space-y-4">
      {/* Общий текст (например: "Да, вот варианты") */}
      {text && (
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {text}
        </ReactMarkdown>
      )}

      {/* Каждый объект: текст → фотки */}
      {flats.map((flat, idx) => {
        console.log("flat: ", flat)
        return <FlatCard key={idx} flat={flat} idx={idx} /> // 👈 Используем новый компонент
      })}
    </div >
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
      const res = await fetch("https://f352b1b4bcc6.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      // 👇 один объект вместо кучи сообщений
      const botMessage: Message = {
        role: "bot",
        text: data.answer || "Нет ответа",
        flats: data.flats || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "bot", text: "Ошибка при запросе" }]);
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
              <FormattedMessage {...msg} />
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
