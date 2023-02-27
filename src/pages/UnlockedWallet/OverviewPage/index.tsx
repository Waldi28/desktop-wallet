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

import { motion } from 'framer-motion'
import styled from 'styled-components'

import { fadeIn } from '@/animations'
import TransactionList from '@/components/TransactionList'
import { useAppSelector } from '@/hooks/redux'
import AddressesContactsList from '@/pages/UnlockedWallet/OverviewPage/AddressesContactsList'
import AmountsOverviewPanel from '@/pages/UnlockedWallet/OverviewPage/AmountsOverviewPanel'
import AssetsList from '@/pages/UnlockedWallet/OverviewPage/AssetsList'
import { UnlockedWalletPanel } from '@/pages/UnlockedWallet/UnlockedWalletLayout'

const OverviewPage = () => {
  const isLoadingData = useAppSelector((state) => state.addresses.loading)

  return (
    <motion.div {...fadeIn}>
      <UnlockedWalletPanel top>
        <AmountsOverviewPanel isLoading={isLoadingData} />
        <Row>
          <AssetsListStyled />
          <AddressesContactsListStyled limit={5} />
        </Row>
        <TransactionList limit={5} />
      </UnlockedWalletPanel>
    </motion.div>
  )
}

export default OverviewPage

const Row = styled.div`
  display: flex;
  gap: 30px;
`

const AssetsListStyled = styled(AssetsList)`
  flex: 4;
`

const AddressesContactsListStyled = styled(AddressesContactsList)`
  flex: 3;
`
