import { ReactNode } from "react"

type DefaultScreenProps = {
    children: ReactNode
}

const DefaultScreen = ({ children }: DefaultScreenProps) => {
    return <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: '10px'
    }}>
        {children}
    </div>
}

export default DefaultScreen;