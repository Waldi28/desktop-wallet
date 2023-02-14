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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { fadeIn } from '@/animations'
import Amount from '@/components/Amount'
import { TabItem } from '@/components/TabBar'
import Table, { TableRow } from '@/components/Table'
import TableCellAmount from '@/components/TableCellAmount'
import TableTabBar from '@/components/TableTabBar'
import { useAppSelector } from '@/hooks/redux'
import i18next from '@/i18n'
import AlephiumLogoSVG from '@/images/alephium_logo_monochrome.svg'
import { selectTokens } from '@/storage/app-state/slices/tokensSlice'

interface TokensNFTsListProps {
  className?: string
  limit?: number
}

const tabs = [
  { value: 'tokens', label: i18next.t('Tokens') },
  { value: 'nfts', label: i18next.t('NFTs') }
]

const TokensNFTsList = ({ className, limit }: TokensNFTsListProps) => {
  const [isLoadingAddresses, tokensStatus] = useAppSelector((s) => [s.addresses.loading, s.tokens.status])

  const showSkeletonLoading = isLoadingAddresses || tokensStatus === 'uninitialized'
  const [currentTab, setCurrentTab] = useState<TabItem>(tabs[0])

  return (
    <Table isLoading={showSkeletonLoading} className={className} minWidth="450px">
      <TableTabBar items={tabs} onTabChange={(tab) => setCurrentTab(tab)} activeTab={currentTab} />
      {
        {
          tokens: <TokensList limit={limit} />,
          nfts: <NFTsList limit={limit} />
        }[currentTab.value]
      }
    </Table>
  )
}

const TokensList = ({ className, limit }: TokensNFTsListProps) => {
  const { t } = useTranslation()
  const tokens = useAppSelector(selectTokens)

  const displayedTokens = limit ? tokens.slice(0, limit) : tokens

  return (
    <motion.div {...fadeIn} className={className}>
      {displayedTokens.map((token) => (
        <TableRow key={token.id} role="row" tabIndex={0}>
          <TokenRow>
            <TokenLogo>
              {/* TODO: uncomment when metadata repo is accessible by the public */}
              {/* <LogoImage src={token.logoURI ?? AlephiumLogoSVG} /> */}
              <LogoImage src={AlephiumLogoSVG} />
            </TokenLogo>
            <NameColumn>
              <TokenName>{token.name}</TokenName>
              <TokenSymbol>{token.symbol}</TokenSymbol>
            </NameColumn>
            <TableCellAmount>
              <TokenAmount fadeDecimals value={token.balance} suffix={token.symbol} />
              {token.lockedBalance > 0 && (
                <TokenAvailableAmount>
                  {t('Available')}
                  <Amount fadeDecimals value={token.balance - token.lockedBalance} suffix={token.symbol} />
                </TokenAvailableAmount>
              )}
            </TableCellAmount>
          </TokenRow>
        </TableRow>
      ))}
    </motion.div>
  )
}

const NFTsList = ({ className }: TokensNFTsListProps) => {
  const { t } = useTranslation()

  return (
    <motion.div {...fadeIn} className={className}>
      <TableRow role="row" tabIndex={0}>
        {t('Coming soon!')}
      </TableRow>
    </motion.div>
  )
}

export default styled(TokensNFTsList)`
  margin-bottom: 45px;
`

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const TokenLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 30px;
  padding: 5px;
  background: linear-gradient(218.53deg, #0075ff 9.58%, #d340f8 86.74%);
  margin-right: 25px;
  flex-shrink: 0;
`

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
`

const TokenName = styled.div`
  font-size: 14px;
  font-weight: var(--fontWeight-semiBold);
  width: 200px;
`

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.font.tertiary};
  font-size: 11px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const TokenAmount = styled(Amount)`
  color: ${({ theme }) => theme.font.secondary};
`

const TokenAvailableAmount = styled.div`
  color: ${({ theme }) => theme.font.tertiary};
  font-size: 10px;
`

const NameColumn = styled(Column)`
  margin-right: 50px;
`