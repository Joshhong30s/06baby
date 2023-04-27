import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useGetUserID } from '../hooks/useGetUserId'
import { useCookies } from 'react-cookie'
import { RiHeartAddLine, RiHeartFill } from 'react-icons/ri'
import ReactPlayer from 'react-player/lazy'
import { FaBaby } from 'react-icons/fa'
import getAge from '../components/getAge'

export default function Home() {
  const [photo, setPhoto] = useState([])

  // getAge
  const birthdate = '2023-04-12' // replace with actual birthdate
  const inputDate = '2023-04-15' // replace with actual input date
  const age = getAge(birthdate, inputDate)

  // empty array of strings
  const [savedPhoto, setSavedPhoto] = useState<string[]>([])
  const [cookies, _] = useCookies(['access_token'])
  const userID = useGetUserID()

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(
          'https://zero6babyserver.onrender.com/photos'
        )
        setPhoto(response.data)
        console.log(response.data)
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSavedPhoto = async () => {
      try {
        const response = await axios.get(
          `https://zero6babyserver.onrender.com/photos/savedPhoto/ids/${userID}`
        )
        setSavedPhoto(response.data.savedPhoto)
      } catch (err) {
        console.log(err)
      }
    }

    fetchPhoto()

    if (cookies.access_token) fetchSavedPhoto()
  }, [cookies.access_token, userID])

  // send update request to backend and wait for response
  const savePhoto = async (photoID: string) => {
    try {
      const response = await axios.put(
        'https://zero6babyserver.onrender.com/photos',
        {
          photoID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      )
      setSavedPhoto(response.data.savedPhoto)
    } catch (err) {
      console.log(err)
    }
  }

  const unsavePhoto = async (photoID: string) => {
    try {
      const response = await axios.delete(
        'https://zero6babyserver.onrender.com/photos',
        {
          data: {
            photoID,
            userID,
          },
          headers: { authorization: cookies.access_token },
        }
      )
      setSavedPhoto(response.data.savedPhoto)
    } catch (err) {
      console.log(err)
    }
  }

  const isPhotoaved = (photoID: string) => savedPhoto.includes(photoID)

  const toggleSavePhoto = (photoID: string) => {
    if (isPhotoaved(photoID)) {
      unsavePhoto(photoID)
    } else {
      savePhoto(photoID)
    }
  }

  const reversedPhoto = photo.slice().reverse()

  return (
    <main>
      <div className='px-6 mx-auto mb-8 text-black'>
        <ul className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
          {reversedPhoto.map(
            (photo: {
              birthday: string
              _id: string
              name: string
              location: string
              instructions: string
              imageUrl: string
              growingTime: number
            }) => (
              <li key={photo._id} className='border border-gray-200 rounded-lg'>
                <div className='relative w-full h-96 sm:h-[450px] lg:h-[600px]'>
                  {photo.imageUrl.endsWith('.jpg') ||
                  photo.imageUrl.endsWith('.png') ? (
                    <Link
                      href={photo.imageUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.name}
                        className='object-cover'
                        fill
                      />
                    </Link>
                  ) : (
                    <ReactPlayer
                      url={photo.imageUrl}
                      fill
                      controls
                      width='100%'
                      height='100%'
                    />
                  )}
                  <button
                    className='absolute top-2 right-2 bg-neutral-50 bg-opacity-30 text-red-500 rounded-full p-3'
                    onClick={() => toggleSavePhoto(photo._id)}
                  >
                    {isPhotoaved(photo._id) ? (
                      <RiHeartFill
                        size={40}
                        className='text-red-500 text-base hover:scale-125'
                      />
                    ) : (
                      <RiHeartAddLine
                        size={40}
                        className='text-base hover:scale-125'
                      />
                    )}
                  </button>
                </div>
                <div className='p-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-3xl font-extrabold pt-1 pb-3 mb-0'>
                      {photo.name}
                    </h3>
                    <div className='flex space-x-1 items-center'>
                      <FaBaby size={30} />
                      {photo.growingTime} days
                    </div>
                  </div>
                  <p className='text-gray-600 text-sm '>
                    照片地點：{photo.location}
                  </p>

                  <p className='text-gray-600 text-sm my-4'>
                    {photo.instructions}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </main>
  )
}
