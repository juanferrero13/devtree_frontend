import { Link } from "react-router-dom"

export const HomeNavigation = () => {
    return (
        <>
            <Link
                className="text-white p-2 font-black uppercase text-xs cursor-pointer"
                to={"/auth/login"}
            >
                iniciar sesión
            </Link>
            <Link
                className="text-slate-800 rounded-lg bg-lime-500 p-2 font-black uppercase text-xs cursor-pointer"
                to={"/auth/register"}
            >
                registrarse
            </Link>
        </>
    )
}
