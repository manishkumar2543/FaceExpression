import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/use.Song'
const Home = () => {
  const {handlerGetSong}=useSong()
  return (
    <>
    <FaceExpression
      onClick={(expression)=>{
        handlerGetSong({mood:expression});
      }}
    />
    <Player/>
    </>
  )
}

export default Home