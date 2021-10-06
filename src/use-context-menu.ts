import { useEffect, useCallback, useState } from 'react'

export const useContextMenu = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [menu, showMenu] = useState(false)

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault()
      setX(event.clientX)
      setY(event.clientY)
      showMenu(true)
    },
    [showMenu, setX, setY]
  )

  const handleClick = useCallback(() => {
    showMenu(false)
  }, [showMenu])

  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleContextMenu)
    return () => {
      document.addEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  })

  return { x, y, menu }
}
