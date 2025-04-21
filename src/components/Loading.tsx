export const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background z-50 fixed top-0 left-0 right-0 bottom-0">
            <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}