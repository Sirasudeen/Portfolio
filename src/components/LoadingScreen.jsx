import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }) => {
    const [count, setCount] = useState(0);



    useEffect(() => {
        let index = 1;
        const updateIndex = () => {
            index += Math.floor(Math.random() * 21) + 10;
            if (index > 101) index = 101;
        };
        const interval = setInterval(() => {
            setCount(index);
            updateIndex();

            if (index == 101) {
                setCount(100);
                console.log("clear interval")
                clearInterval(interval);

                setTimeout(() => {
                    onComplete();
                }, 1000);
            }
        }, 600);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black text-gray-100 flex flex-col items-center justify-center">
            <div className="mb-4 text-4xl font-mono font-bold">
                {count} <span > % </span>
            </div>

            <div className="w-[200px] h-[2px] bg-gray-800 rounded relative overflow-hidden">
                <div className="w-[40%] h-full bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-loading-bar"></div>
            </div>
        </div>
    );
};