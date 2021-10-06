import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { getTargetingCookies } from './cookie-utils'
import { Input } from '@builder.io/sdk'
import {
  ControlledMenu,
  FocusableItem,
  MenuHeader,
  MenuItem,
  MenuRadioGroup,
  SubMenu,
  useMenuState,
} from '@szhsin/react-menu'

import { useContextMenu } from './use-context-menu'

export interface TargetingAttributes {
  [key: string]: Input
}

export const Configurator: React.FC<{
  targetingAttributes?: TargetingAttributes
  attributesApiPath?: string
}> = ({ targetingAttributes, attributesApiPath }) => {
  const router = useRouter()
  const { x, y, menu } = useContextMenu()

  const [attributes, setAttributes] = useState(targetingAttributes)
  useEffect(() => {
    if (!attributes) {
      fetch(attributesApiPath || '/api/attributes')
        .then((res) => res.json())
        .then(setAttributes)
        .then(() => {
          if (attributes && menu) {
            toggleMenu(true)
          }
        })
    }
  }, [])
  const setCookie = (name: string, val: string) => () => {
    Cookies.set(`builder.userAttributes.${name}`, val)
    router.reload()
  }

  const reset = () => {
    const cookies = getTargetingCookies(Cookies.get())
    cookies.forEach((cookie) => Cookies.remove(cookie))
    router.reload()
  }

  const { toggleMenu, ...menuProps } = useMenuState()

  useEffect(() => {
    if (menu && attributes) {
      toggleMenu(true)
    }
  }, [menu])

  if (!attributes) {
    return null
  }
  const keys = Object.keys(attributes)

  return (
    <ControlledMenu
      {...menuProps}
      anchorPoint={{ x, y }}
      onClose={() => toggleMenu(false)}
    >
      <MenuHeader>Personalization settings</MenuHeader>
      <MenuItem onClick={reset}>Reset</MenuItem>

      {keys.sort().map((attr, index) => {
        const options = attributes[attr].enum as string[]
        return (
          <SubMenu key={index} label={`${attr} settings`}>
            {options ? (
              <MenuRadioGroup
                value={Cookies.get(`builder.userAttributes.${attr}`)}
              >
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    onClick={setCookie(attr, String(option))}
                  >
                    {option}
                  </MenuItem>
                ))}
              </MenuRadioGroup>
            ) : (
              <FocusableItem>
                {({ ref }) => (
                  <form
                    onSubmit={(e) => {
                      const data = new FormData(e.currentTarget)
                      const values = Object.fromEntries(data.entries())
                      e.preventDefault()
                      setCookie(attr, values[attr] as string)()
                    }}
                  >
                    <input
                      ref={ref}
                      name={attr}
                      type="text"
                      defaultValue={Cookies.get(
                        `builder.userAttributes.${attr}`
                      )}
                    />
                  </form>
                )}
              </FocusableItem>
            )}
          </SubMenu>
        )
      })}
    </ControlledMenu>
  )
}
