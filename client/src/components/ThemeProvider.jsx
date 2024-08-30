import { useEffect } from "react"
import { useSelector } from "react-redux"

const ThemeProvider = ({children}) => {
  const { theme } = useSelector(state => state.theme)
 
  useEffect(() => {}, [theme])

  return (
    <div className={theme}>
      <div className="bg-slate-50 text-gray-700 dark:text-gray-200 dark:bg-dark-mode min-h-screen">
        { children }
      </div>
    </div>
  )
}

export default ThemeProvider