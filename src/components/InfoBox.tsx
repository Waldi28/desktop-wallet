// Copyright 2018 - 2021 The Alephium Authors
// This file is part of the alephium project.
//
// The library is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// The library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with the library. If not, see <http://www.gnu.org/licenses/>.

import styled, { css, useTheme } from 'styled-components'
import { LucideProps } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

interface InfoBoxProps {
  text: string
  Icon?: (props: LucideProps) => JSX.Element
  label?: string
  importance?: 'accent' | 'alert'
  className?: string
  ellipsis?: boolean
  wordBreak?: boolean
  onClick?: () => void
  small?: boolean
}

const variants: Variants = {
  hidden: { y: 10, opacity: 0 },
  shown: { y: 0, opacity: 1 }
}

export const InfoBox = ({
  Icon,
  text,
  label,
  importance,
  className,
  ellipsis,
  wordBreak,
  onClick,
  small
}: InfoBoxProps) => {
  const theme = useTheme()

  return (
    <BoxContainer className={className} onClick={onClick} small={small}>
      {label && <Label variants={variants}>{label}</Label>}
      <StyledBox variants={variants} importance={importance}>
        {Icon && (
          <IconContainer>
            <Icon color={importance ? theme.global[importance] : theme.global.accent} strokeWidth={1.5} />
          </IconContainer>
        )}
        <TextContainer wordBreak={wordBreak} ellipsis={ellipsis}>
          {text}
        </TextContainer>
      </StyledBox>
    </BoxContainer>
  )
}

// === Styling === //
const BoxContainer = styled.div<{ small?: boolean }>`
  width: 100%;
  margin: 0 auto var(--spacing-20) auto;
  margin-top: var(--spacing-10);
  max-width: ${({ small }) => (small ? '300px' : 'initial')};
`

const IconContainer = styled.div`
  flex: 1;
  display: flex;
  max-width: 100px;

  svg {
    height: 30%;
    width: 30%;
    margin: auto;
  }
`

const TextContainer = styled.p<{ wordBreak?: boolean; ellipsis?: boolean }>`
  padding: 0 var(--spacing-20);
  flex: 2;
  font-weight: var(--fontWeight-medium);
  word-break: ${({ wordBreak }) => (wordBreak ? 'break-all' : 'initial')};

  ${({ ellipsis }) => {
    return ellipsis
      ? css`
          overflow: 'hidden';
          textoverflow: 'ellipsis';
        `
      : css`
          overflowwrap: 'anywhere';
        `
  }}
`

const StyledBox = styled(motion.div)<{ importance?: 'accent' | 'alert' }>`
  padding: var(--spacing-10) var(--spacing-20) var(--spacing-10) 0;
  background-color: ${({ theme }) => theme.bg.primary};
  border: 1px solid ${({ theme, importance }) => (importance === 'alert' ? theme.global.alert : theme.border.primary)};
  display: flex;
  border-radius: var(--radius);
  box-shadow: 0 5px 5px var(--color-shadow-5);
  align-items: center;
`

const Label = styled(motion.label)`
  display: block;
  width: 100%;
  margin-left: var(--spacing-15);
  margin-bottom: var(--spacing-7);
  color: ${({ theme }) => theme.font.secondary};
  font-weight: var(--fontWeight-medium);
`
