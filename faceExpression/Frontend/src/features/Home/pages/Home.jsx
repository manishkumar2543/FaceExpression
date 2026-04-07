import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import { useSong } from '../hooks/use.Song'

const Home = () => {
  const { handlerGetSong } = useSong()

  return (
    <FaceExpression
      onClick={(expression) => {
        if (!expression || expression === 'No Face Detected') return
        handlerGetSong({ mood: expression })
      }}
    />
  )
}

export default Home
