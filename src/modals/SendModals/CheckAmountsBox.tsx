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

import { Fragment } from 'react'
import styled from 'styled-components'

import Amount from '@/components/Amount'
import AssetLogo from '@/components/AssetLogo'
import Box from '@/components/Box'
import HorizontalDivider from '@/components/PageComponents/HorizontalDivider'
import { useAppSelector } from '@/hooks/redux'
import { ALPH } from '@/storage/app-state/slices/assetsInfoSlice'
import { AssetAmount } from '@/types/assets'
import { getTransactionAssetAmounts } from '@/utils/transactions'

interface CheckAmountsBoxProps {
  assetAmounts: AssetAmount[]
  className?: string
}

const CheckAmountsBox = ({ assetAmounts, className }: CheckAmountsBoxProps) => {
  const { attoAlphAmount, tokens } = getTransactionAssetAmounts(assetAmounts)
  const assetsInfo = useAppSelector((state) => state.assetsInfo.entities)

  const assets = [{ id: ALPH.id, amount: attoAlphAmount }, ...tokens]

  return (
    <Box className={className}>
      {assets.map((asset) => {
        const assetInfo = assetsInfo[asset.id]

        return (
          <Fragment key={asset.id}>
            <HorizontalDivider />
            <AssetAmountRow>
              {assetInfo && <AssetLogoStyled asset={assetInfo} size={30} />}
              <AssetAmountStyled
                value={BigInt(asset.amount)}
                suffix={assetInfo?.symbol}
                decimals={assetInfo?.decimals}
              />
            </AssetAmountRow>
          </Fragment>
        )
      })}
    </Box>
  )
}

export default CheckAmountsBox

const AssetAmountRow = styled.div`
  display: flex;
  padding: 23px 0;
  justify-content: center;
  align-items: center;
`

const AssetLogoStyled = styled(AssetLogo)`
  margin-right: 25px;
`

const AssetAmountStyled = styled(Amount)`
  font-weight: var(--fontWeight-semiBold);
  font-size: 26px;
`
