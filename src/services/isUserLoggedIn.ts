export const isUserLoggedIn = (): boolean => {
    const token = localStorage.getItem("token");

    if (!token) return false;


    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000; // in seconds

        if (currentTime > decodedToken.exp) {
            localStorage.removeItem("token");
            return false
        }
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
            localStorage.removeItem("token");
            return false
        }
    return true;
};
