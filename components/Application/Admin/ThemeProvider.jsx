import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemeProvider = ({ children, ...props }) => {
     return <NextThemesProvider {...props} suppressHydrationWarning={true} >{children}</NextThemesProvider>
}

export default ThemeProvider