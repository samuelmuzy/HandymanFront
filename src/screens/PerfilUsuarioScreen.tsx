import { useParams } from "react-router-dom";


export const PerfilUsuarioScreen = () =>{
    const { id } = useParams<{ id: string }>();
    
    return(
        <>
            <p>{id}</p>
        </>
    )
}