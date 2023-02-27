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

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Toggle from '@/components/Inputs/Toggle'
import { useAppSelector } from '@/hooks/redux'
import ModalPortal from '@/modals/ModalPortal'
import NewAddressModal from '@/modals/NewAddressModal'
import AddressCard from '@/pages/UnlockedWallet/AddressesPage/AddressCard'
import TabContent from '@/pages/UnlockedWallet/AddressesPage/TabContent'
import { selectAllAddresses } from '@/storage/app-state/slices/addressesSlice'
import { filterAddresses } from '@/utils/addresses'

const AddressesTabContent = () => {
  const addresses = useAppSelector(selectAllAddresses)
  const assetsInfo = useAppSelector((state) => state.assetsInfo.entities)
  const { t } = useTranslation()

  const [isGenerateNewAddressModalOpen, setIsGenerateNewAddressModalOpen] = useState(false)
  const [visibleAddresses, setVisibleAddresses] = useState(addresses)
  const [searchInput, setSearchInput] = useState('')
  const [hideEmptyAddresses, setHideEmptyAddresses] = useState(false)

  useEffect(() => {
    const filteredByText = filterAddresses(addresses, searchInput.toLowerCase(), assetsInfo)
    const filteredByToggle = hideEmptyAddresses
      ? filteredByText.filter((address) => address.balance !== '0')
      : filteredByText

    setVisibleAddresses(filteredByToggle)
  }, [addresses, assetsInfo, hideEmptyAddresses, searchInput])

  return (
    <TabContent
      searchPlaceholder={t('Search for label, a hash or an asset...')}
      onSearch={setSearchInput}
      buttonText={`+ ${t('New address')}`}
      onButtonClick={() => setIsGenerateNewAddressModalOpen(true)}
      newItemPlaceholderText={t('Addresses allow you to organise your funds. You can create as many as you want!')}
      HeaderMiddleComponent={
        <HideEmptyAddressesToggle>
          <ToggleText>{t('Hide empty addresses')}</ToggleText>
          <Toggle onToggle={setHideEmptyAddresses} label={t('Hide empty addresses')} toggled={hideEmptyAddresses} />
        </HideEmptyAddressesToggle>
      }
    >
      {visibleAddresses.map((address) => (
        <AddressCard hash={address.hash} key={address.hash} />
      ))}

      <ModalPortal>
        {isGenerateNewAddressModalOpen && (
          <NewAddressModal
            singleAddress
            title={t('New address')}
            onClose={() => setIsGenerateNewAddressModalOpen(false)}
          />
        )}
      </ModalPortal>
    </TabContent>
  )
}

export default AddressesTabContent

const HideEmptyAddressesToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 250px;
  background-color: ${({ theme }) => theme.bg.primary};
  padding: 10px 18px 10px 22px;
  border-radius: var(--radius-medium);
`

const ToggleText = styled.div`
  font-weight: var(--fontWeight-semiBold);
  color: ${({ theme }) => theme.font.secondary};
`
