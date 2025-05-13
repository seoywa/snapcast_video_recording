import Header from '@/components/Header'
import VideoCard from '@/components/VideoCard'
import { dummyCards } from '@/constants'
import React from 'react'

const ProfilePage = async ({ params }: ParamsWithSearch) => {
  const { id } = await params

  return (
    <div className='wrapper page'>
      <h1 className='text-2xl font-karla'>USER ID: {id}</h1>
      <section className='video-grid'>
        {dummyCards.map(card => (
          <VideoCard {...card} key={card.id}/>
        ))}
      </section>

      <Header subHeader='mock_email@gmail.com' title='JADE | MockUser' />
    </div>
  )
}

export default ProfilePage