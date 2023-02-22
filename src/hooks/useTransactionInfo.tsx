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

import {
  calcTxAmountsDeltaForAddress,
  getDirection,
  isConsolidationTx,
  TransactionDirection,
  TransactionInfoType
} from '@alephium/sdk'
import { AssetOutput, Output, Token } from '@alephium/sdk/api/explorer'

import { useAppSelector } from '@/hooks/redux'
import { selectAllAddresses } from '@/storage/app-state/slices/addressesSlice'
import { AddressHash } from '@/types/addresses'
import { AddressTransaction } from '@/types/transactions'
import { hasOnlyOutputsWith, isPendingTx } from '@/utils/transactions'

export const useTransactionInfo = (tx: AddressTransaction, addressHash: AddressHash, showInternalInflows?: boolean) => {
  const addresses = useAppSelector(selectAllAddresses)

  let amount: bigint | undefined = BigInt(0)
  let direction: TransactionDirection
  let infoType: TransactionInfoType
  let outputs: Output[] = []
  let lockTime: Date | undefined
  let tokens: {
    id: Token['id']
    amount: bigint
  }[] = []

  if (isPendingTx(tx)) {
    direction = 'out'
    infoType = 'pending'
    // TODO: Consider tokens...
    amount = tx.amount ? BigInt(tx.amount) : undefined
    lockTime = tx.lockTime !== undefined ? new Date(tx.lockTime) : undefined
  } else {
    outputs = tx.outputs ?? outputs
    const { alph: alphAmount, tokens: tokenAmounts } = calcTxAmountsDeltaForAddress(tx, addressHash)

    amount = alphAmount < 0 ? alphAmount * BigInt(-1) : alphAmount
    tokens = tokenAmounts.map((token) => ({
      id: token.id,
      amount: token.amount < 0 ? token.amount * BigInt(-1) : token.amount
    }))

    if (isConsolidationTx(tx)) {
      // TODO: Consider tokens
      direction = 'out'
      infoType = 'move'
    } else {
      // TODO: Should the direction be defined only by the direction of ALPH?
      // Can one transaction have multiple directions for different tokens/ALPH?
      direction = getDirection(tx, addressHash)
      const isInternalTransfer = hasOnlyOutputsWith(outputs, addresses)
      infoType =
        (isInternalTransfer && showInternalInflows && direction === 'out') ||
        (isInternalTransfer && !showInternalInflows)
          ? 'move'
          : direction
    }

    lockTime = outputs.reduce(
      (a, b) => (a > new Date((b as AssetOutput).lockTime ?? 0) ? a : new Date((b as AssetOutput).lockTime ?? 0)),
      new Date(0)
    )
    lockTime = lockTime.toISOString() === new Date(0).toISOString() ? undefined : lockTime
  }

  return {
    amounts: {
      alph: amount,
      tokens
    },
    direction,
    infoType,
    outputs,
    lockTime
  }
}
