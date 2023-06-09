'use client'

import Select from 'react-select'

import { useState, useEffect } from 'react'
import { components } from 'react-select'
import Image from 'next/image'

const MenuList = (props: any) => (
  <components.MenuList {...props} className='grid grid-cols-4 gap-2'>
    {props.children}
  </components.MenuList>
)

export default function Message() {
  const [formData, setFormData] = useState({
    avatar: '',
    name: '',
    message: '',
  })

  const handleAvatarChange = (selectedOption: any) => {
    setFormData({
      ...formData,
      avatar: selectedOption.value,
    })
  }

  const avatarOptions = [
    { value: '/01.svg', label: 'Avatar 1' },
    { value: '/02.svg', label: 'Avatar 2' },
    { value: '/03.svg', label: 'Avatar 3' },
    { value: '/04.svg', label: 'Avatar 4' },
    { value: '/05.svg', label: 'Avatar 5' },
    { value: '/06.svg', label: 'Avatar 6' },
    { value: '/07.svg', label: 'Avatar 7' },
    { value: '/08.svg', label: 'Avatar 8' },
    { value: '/09.svg', label: 'Avatar 9' },
    { value: '/10.svg', label: 'Avatar 10' },
    { value: '/11.svg', label: 'Avatar 11' },
    { value: '/12.svg', label: 'Avatar 12' },
    { value: '/13.svg', label: 'Avatar 13' },
    { value: '/14.svg', label: 'Avatar 14' },
    { value: '/15.svg', label: 'Avatar 15' },
    { value: '/16.svg', label: 'Avatar 16' },
  ]

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        alert('success!!!')
        setFormData({
          avatar: '',
          name: '',
          message: '',
        })
        setRefresh(refresh + 1)
      } else {
        throw new Error('Error submitting data')
      }
    } catch (error) {
      console.error('Error submitting data:', error)
      alert('Error submitting data')
    }
  }

  // Add state variable for storing messages
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    fetchMessages()
  }, [refresh])

  // Fetch message board data from Google Sheets
  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/loading', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)

        // Extract the values property from the fetched data
        const values = data.messages || []

        console.log('values:', values)
        const formattedMessages = values.slice(1).map((row: any) => {
          return {
            date: row[0],
            avatar: row[1],
            name: row[2],
            message: row[3],
          }
        })
        console.log('formattedMessages:', formattedMessages)
        setMessages(formattedMessages) // Store fetched messages in the state
      } else {
        throw new Error('Error loading data')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error loading data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative'>
      <Image
        src='/bao12.jpeg'
        alt='message'
        fill
        quality={10}
        className='inset-0 -z-10 opacity-20 absolute object-cover'
      />
      <div className='mx-auto p-4 md:p-8 min-h-screen bg-cover bg-center'>
        <div className='flex flex-col md:flex-row gap-16 justify-center '>
          <div className='w-full  h-full md:w-1/3 bg-white rounded-md shadow-md p-6'>
            <h2 className='text-2xl text-center font-medium mb-6'>
              我要留言給小寶
            </h2>
            <form className='space-y-6' onSubmit={handleSubmit}>
              <label
                className='block text-gray-700 font-medium text-lg'
                htmlFor='avatar'
              >
                我的頭像
              </label>
              <Select
                name='avatar'
                id='avatar'
                value={avatarOptions.find(
                  (option) => option.value === formData.avatar
                )}
                onChange={handleAvatarChange}
                options={avatarOptions}
                placeholder='請在下方選擇一個頭像'
                formatOptionLabel={(option) => (
                  <div className=''>
                    <img
                      src={option.value}
                      alt={option.label}
                      className='w-30 h-30 hover:cursor-pointer'
                    />
                  </div>
                )}
                components={{ MenuList }}
              />
              <div>
                <label
                  htmlFor='name'
                  className='block text-gray-700 font-medium text-lg'
                >
                  我的稱呼
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='我是誰..'
                  onChange={handleChange}
                  value={formData.name}
                  className='mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-blue-980 focus:ring-1 focus:ring-blue-980 focus:ring-opacity-50'
                />
              </div>
              <div className='whitespace-pre-wrap'>
                <label
                  htmlFor='message'
                  className='block text-gray-700 font-medium text-lg'
                >
                  我的留言
                </label>
                <textarea
                  id='message'
                  name='message'
                  onChange={handleChange}
                  value={formData.message}
                  className='mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300  focus:outline-none whitespace-pre-wrap'
                  placeholder='請在這裡寫下要對小寶說的話..'
                ></textarea>
              </div>
              <div className='py-4 text-center'>
                <button
                  type='submit'
                  className='hover:bg-teal-980 hover:text-gray-100 text-slate-600 bg-blue-980 text-xl font-medium py-4 px-6 rounded-lg transition-colors duration-300'
                >
                  送出
                </button>
              </div>
            </form>
          </div>
          <div className='w-full h-full md:w-1/3 bg-white rounded-md shadow-md p-6'>
            <h2 className='text-2xl text-center font-medium mb-6'>
              小寶留言板
            </h2>
            <div className='space-y-6 overflow-y-auto max-h-[600px]'>
              {loading ? (
                <div className='flex justify-center items-center h-64'>
                  <span className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900'></span>
                  <span className='sr-only'>讀取留言中 ...</span>
                </div>
              ) : (
                messages.reverse().map(({ date, avatar, name, message }) => (
                  <div
                    key={`${date}-${name}`}
                    className='bg-gray-100 p-4 rounded-md shadow-md border border-gray-200'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center'>
                        <img
                          src={avatar}
                          alt={name}
                          className='w-10 h-10 rounded-full mr-3'
                        />
                        <h3 className='font-semibold text-lg'>{name}</h3>
                      </div>
                      <p className='text-gray-500 text-sm'>{date}</p>
                    </div>
                    <p className='text-gray-700'>{message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
