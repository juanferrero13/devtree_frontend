type ErrorMessageProps = {
    children: React.ReactNode
}

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
    return (
        <p className=" text-red-600 p-3 uppercase font-bold text-center text-sm">
            {children}
        </p>
    )
}
