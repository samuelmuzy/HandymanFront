import { useProtectedPage } from "../hooks/useVerifyToken";

export const SecurityPage = () => {
    
    useProtectedPage();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <p className="p-44 text-black">Seguro</p>
        </div>
    )
};