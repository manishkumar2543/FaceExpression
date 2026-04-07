import { useContext } from 'react'
import {getSong} from '../services/song.api'
import { SongContext } from '../song.context'



export const useSong=()=>{

    const context=useContext(SongContext)

    const {song,setSong,loading,setLoading,...playerControls}=context;
    
    const handlerGetSong=async({mood})=>{
        try{
            setLoading(true);
            const data=await getSong({mood});
            const normalizedSong = Array.isArray(data.song) ? data.song[0] : data.song;
            if (normalizedSong) {
                setSong(normalizedSong);
            }
        } finally {
            setLoading(false);
        }
    }
    return(
        {loading,handlerGetSong,song,...playerControls}
    )

}
