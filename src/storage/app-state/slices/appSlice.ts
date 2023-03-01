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

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { languageChangeFinished, languageChangeStarted } from '@/storage/app-state/actions'
import { activeWalletDeleted, walletLocked, walletSaved } from '@/storage/app-state/slices/activeWalletSlice'
import { addressDiscoveryFinished, addressDiscoveryStarted } from '@/storage/app-state/slices/addressesSlice'
import { themeSettingsChanged } from '@/storage/app-state/slices/settingsSlice'
import SettingsStorage from '@/storage/persistent-storage/settingsPersistentStorage'
import WalletStorage from '@/storage/persistent-storage/walletPersistentStorage'
import { GeneralSettings, ThemeType } from '@/types/settings'

const sliceName = 'app'

interface AppState {
  loading: boolean
  visibleModals: string[]
  addressesPageInfoMessageClosed: boolean
  storedWalletNames: string[]
  theme: Omit<ThemeType, 'system'>
}

const storedSettings = SettingsStorage.load('general') as GeneralSettings

const initialState: AppState = {
  loading: false,
  visibleModals: [],
  addressesPageInfoMessageClosed: false,
  storedWalletNames: WalletStorage.list(),
  theme: storedSettings.theme === 'system' ? 'dark' : storedSettings.theme
}

const appSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    appLoadingToggled: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    modalOpened: (state, action: PayloadAction<string>) => {
      const modalId = action.payload

      state.visibleModals.push(modalId)
    },
    modalClosed: (state) => {
      state.visibleModals.pop()
    },
    addressesPageInfoMessageClosed: (state) => {
      state.addressesPageInfoMessageClosed = true
    },
    walletDeleted: (state, action: PayloadAction<string>) => {
      const deletedWalletName = action.payload

      state.storedWalletNames = state.storedWalletNames.filter((walletName) => walletName !== deletedWalletName)
    },
    osThemeChangeDetected: (state, action: PayloadAction<AppState['theme']>) => {
      state.theme = action.payload
    }
  },
  extraReducers(builder) {
    builder
      .addCase(addressDiscoveryStarted, (state, action) => toggleLoading(state, true, action.payload))
      .addCase(addressDiscoveryFinished, (state, action) => toggleLoading(state, false, action.payload))
      .addCase(languageChangeStarted, (state) => {
        state.loading = true
      })
      .addCase(languageChangeFinished, (state) => {
        state.loading = false
      })
      .addCase(walletLocked, () => initialState)
      .addCase(walletSaved, (state, action) => {
        const newWallet = action.payload.wallet

        state.storedWalletNames.push(newWallet.name)
      })
      .addCase(activeWalletDeleted, () => ({
        ...initialState,
        storedWalletNames: WalletStorage.list()
      }))
      .addCase(themeSettingsChanged, (state, action) => {
        const theme = action.payload
        if (theme !== 'system') state.theme = theme
      })
  }
})

export const {
  appLoadingToggled,
  modalOpened,
  modalClosed,
  addressesPageInfoMessageClosed,
  walletDeleted,
  osThemeChangeDetected
} = appSlice.actions

export default appSlice

const toggleLoading = (state: AppState, toggle: boolean, enableLoading?: boolean) => {
  if (enableLoading !== false) state.loading = toggle
}
