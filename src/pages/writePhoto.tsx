'use client';
import dayjs from 'dayjs';
import { useState } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserId';
import { useCookies } from 'react-cookie';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

type PhotoType = {
  name: string;
  location: string;
  instructions: string;
  imageUrl: string;
  growingTime: string;
  userOwner: string;
};

export default function WritePhoto() {
  const userID = useGetUserID();
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [allowYoutubeUrl, setAllowYoutubeUrl] = useState(false);
  const [photo, setPhoto] = useState<PhotoType>({
    name: '',
    location: '',
    instructions: '',
    imageUrl: '',
    growingTime: '',
    userOwner: userID ?? '',
  });

  const handleChange = (e: any) => {
    setPhoto({
      ...photo,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setPhoto({
      ...photo,
      growingTime: dayjs(selectedDate).toISOString(),
    });
  };

  const handleImageChange = async (e: any) => {
    if (allowYoutubeUrl) {
      const inputUrl = e.target.value;
      setPhoto({
        ...photo,
        imageUrl: inputUrl,
      });
    } else {
      const file = e.target.files[0];
      setFile(file);

      if (file) {
        const clientId = '204e2ddd7271745';
        const auth = 'Client-ID ' + clientId;
        const data = new FormData();
        const filename = file.name;
        data.append('name', filename);
        data.append('image', file);

        try {
          const response = await axios.post(
            'https://api.imgur.com/3/image',
            data,
            {
              headers: {
                Authorization: auth,
                Accept: 'application/json',
              },
            }
          );

          alert('相片上傳成功，可以送出');
          setPhoto({
            ...photo,
            imageUrl: response.data.data.link,
          });
        } catch (err) {
          console.log(err);
          alert('相片上傳失敗');
        }
      } else {
        alert('請上傳相片');
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session || !session.user) {
      alert('用戶未登入，請先登入');
      return;
    }
    console.log('session', session);
    const token = session.user.accessToken || session?.user?.id;
    console.log('token', token);

    if (!token) {
      alert('Access token 未找到，請重新登入');
      return;
    }
    try {
      await axios.post('/api/photo/photo', photo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('photo created');
      window.location.replace('/');
    } catch (error) {
      console.log(error);
      alert('Failed to upload image');
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900/70 flex flex-col items-center bg-cover bg-center "
      style={{ backgroundImage: "url('bao6.jpeg')" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mt-10">
        <h2 className="text-2xl text-center font-medium mb-6">小寶日誌..</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium text-lg"
            >
              相片標題
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="...這張照片是"
              onChange={handleChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium text-lg"
            >
              相片地點
            </label>

            <div>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="...照片拍攝地點"
                onChange={handleChange}
                className="mt-1 block w-full  h-8 border-b-2 border-gray-300  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="whitespace-pre-wrap">
            <label
              htmlFor="instructions"
              className="block text-gray-700 font-medium text-lg"
            >
              照片描述
            </label>
            <textarea
              id="instructions"
              name="instructions"
              onChange={handleChange}
              className="mt-1 block w-full resize-none md:h-48 border-b-2 border-gray-300  focus:outline-none whitespace-pre-wrap"
              placeholder="...寫下照片描述"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="growingTime"
              className="block text-gray-700 font-medium text-lg"
            >
              相片年齡
            </label>
            <input
              type="date"
              id="growingTime"
              name="growingTime"
              placeholder="...照片裡的年齡"
              onChange={handleDateChange}
              className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <input
              type="radio"
              id="image"
              name="image"
              onChange={() => setAllowYoutubeUrl(true)}
              className="mr-2"
            />
            <label htmlFor="image">貼上 YouTube 影片連結</label>
            <br />
            <input
              type="radio"
              id="image"
              name="image"
              onChange={() => setAllowYoutubeUrl(false)}
              className="mr-2"
            />
            <label htmlFor="image">上傳小寶照片</label>
          </div>
          <div>
            {allowYoutubeUrl && (
              <input
                type="text"
                id="youtubeUrl"
                name="youtubeUrl"
                placeholder="貼上 YouTube 連結"
                onChange={handleImageChange}
                className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              />
            )}
            {!allowYoutubeUrl && (
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="mt-1 block w-full h-8 border-b-2 border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
              />
            )}
            {file && <img src={URL.createObjectURL(file)} alt="" />}
          </div>

          <div className="py-4 text-center">
            <button
              type="submit"
              className=" py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-teal-980 hover:text-gray-100 text-slate-600 bg-blue-980  "
            >
              確認送出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
