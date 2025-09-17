import { useEffect, useState } from "react";
import { Phone, Heart, Share2, X } from "lucide-react";

type Flat = {
    title?: string;
    district?: string;
    street?: string;
    price?: string;
    infrastructure?: string;
    mortgageProgram?: string;
    downPayment?: string;
    contactLink?: string;
    photos?: string[];
};

const FlatCard = ({ flat, idx }: { flat: Flat; idx: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const openGallery = (index: number) => {
        setActiveIndex(index);
        setIsOpen(true);
    };

    useEffect(() => {
        if (isOpen) {
            // Блокируем скролл
            document.body.style.overflow = "hidden";
        } else {
            // Возвращаем скролл
            document.body.style.overflow = "";
        }

        // Чистим при размонтировании
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            <div
                key={idx}
                className="border rounded-2xl p-3 shadow-sm bg-white flex flex-col space-y-3"
            >
                {/* Галерея (превью) */}
                {flat.photos && flat.photos.length > 0 && (
                    <div className="flex overflow-x-auto space-x-3 pb-2 snap-x snap-mandatory">
                        {flat.photos.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Фото ${i + 1}`}
                                className="w-[60vw] max-w-sm h-56 object-cover rounded-lg flex-shrink-0 snap-center cursor-pointer"
                                onClick={() => openGallery(i)}
                            />
                        ))}
                    </div>
                )}

                {/* Заголовок и цена */}
                <div className="flex flex-col">
                    <h3 className="font-semibold text-base text-gray-900 line-clamp-1">
                        {flat.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                        {flat.district}, {flat.street}
                    </p>
                    <p className="font-bold text-xl text-green-700">{flat.price}</p>
                </div>

                {/* Дополнительно */}
                {flat.infrastructure && (
                    <p className="text-gray-500 text-xs">
                        Удобства: {flat.infrastructure}
                    </p>
                )}
                {flat.mortgageProgram && (
                    <p className="text-xs text-gray-500">
                        Ипотека: {flat.mortgageProgram} (взнос от {flat.downPayment})
                    </p>
                )}

                {/* Действия */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <a
                        href={flat.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 font-medium text-sm hover:underline"
                    >
                        Подробнее
                    </a>

                    <div className="flex space-x-3 text-gray-500">
                        <a href={`tel:+77071234569`}>
                            <Phone className="w-5 h-5 hover:text-green-600" />
                        </a>
                        <button>
                            <Heart className="w-5 h-5 hover:text-red-500" />
                        </button>
                        <button>
                            <Share2 className="w-5 h-5 hover:text-blue-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isOpen && flat.photos && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
                    {/* Закрытие */}
                    <button
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Галерея слайдом */}
                    <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory items-center">
                        {flat.photos.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Фото ${i + 1}`}
                                className="w-full h-full object-contain flex-shrink-0 snap-center"
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default FlatCard;
