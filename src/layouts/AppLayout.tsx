import { useQuery } from "@tanstack/react-query"
import { Navigate } from "react-router-dom"
import { getUser } from "../api/DevTreeAPI"
import { DevTree } from "../components/DevTree"

export default function AppLayout() {
    const { data, isLoading, isError } = useQuery({
        // queryFn (query function es la función que va a hacer la consulta a la API)
        queryFn: getUser,
        queryKey: ["user"],
        retry: 2,
        refetchOnWindowFocus: false,
    })

    if (isLoading) return <p className="text-center mt-10">Cargando...</p>
    if (isError) {
        return <Navigate to={"/auth/login"} />
    }

    if (data) return <DevTree data={data} />
}
