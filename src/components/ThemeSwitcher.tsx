/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Toggle from '@/components/Inputs/Toggle'
import { useAppSelector } from '@/hooks/redux'
import { switchTheme } from '@/storage/storage-utils/settingsStorageUtils'

const ThemeSwitcher = () => {
  const { t } = useTranslation()
  const { theme } = useAppSelector((state) => state.app)

  const isDark = theme === 'dark'

  return (
    <Toggle
      label={t('Activate dark mode')}
      ToggleIcons={[Sun, Moon]}
      handleColors={['var(--color-orange)', 'var(--color-purple)']}
      toggled={isDark}
      onToggle={() => switchTheme(isDark ? 'light' : 'dark')}
    />
  )
}

export default ThemeSwitcher
