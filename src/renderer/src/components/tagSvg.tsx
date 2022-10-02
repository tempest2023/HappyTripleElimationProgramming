import { FC } from 'react'

export const EasySvg: FC = () => {
  return (
    <svg width="50" height="28">
      <text x="10" y="18" fill="rgb(67, 160, 71)">
        Easy
      </text>
    </svg>
  )
}

export const MediumSvg: FC = () => {
  return (
    <svg width="80" height="28">
      <text x="10" y="18" fill="rgb(239, 108, 0)">
        Medium
      </text>
    </svg>
  )
}

export const HardSvg: FC = () => {
  return (
    <svg width="50" height="28">
      <text x="10" y="18" fill="rgb(233, 30, 99)">
        Hard
      </text>
    </svg>
  )
}
