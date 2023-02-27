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

import styled from 'styled-components'

import AssetLogo from '@/components/AssetLogo'
import { useAppSelector } from '@/hooks/redux'
import { selectAssetInfoById } from '@/storage/app-state/slices/assetsInfoSlice'
import { Asset } from '@/types/assets'

interface AssetBadgeProps {
  assetId: Asset['id']
  className?: string
}

const AssetBadge = ({ assetId, className }: AssetBadgeProps) => {
  const assetInfo = useAppSelector((state) => selectAssetInfoById(state, assetId))

  if (!assetInfo) return null

  return (
    <div className={className}>
      <AssetLogo asset={assetInfo} size={20} />
      <AssetSymbol>{assetInfo.symbol}</AssetSymbol>
    </div>
  )
}

export default styled(AssetBadge)`
  display: flex;
  align-items: center;
  gap: 16px;
`

const AssetSymbol = styled.div`
  font-weight: var(--fontWeight-semiBold);
`
