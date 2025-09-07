import React, { useState } from 'react';
import emailjs from 'emailjs-com';
//import { assets } from '../assets/assets';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(
      'service_vurwljq', 
      'template_o8xqmf5', 
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
      'RX9YcpAwFIgOxlCYw' 
    )
    .then(() => {
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    })
    .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-auto justify-center md:flex-row gap-10 mb-28 text-sm'>
        {/*<img className='w-full md:max-w-[360px]' src={assets.contact_image} alt='' />*/}
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>32, Anandapur, Kolkata <br/> Phn.No.: +91 8434555132<br/> E-mail: e-waste_raah2025@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at E-Waste Raah</p>
          <p>Learn more about our teams and job openings</p>
          <button className='border border-black px-8 py-4 text-sm hover:!bg-black hover:text-white transition-all duration-500'>Explore jobs</button>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-10 p-6 !bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Contact Us</h2>
        {success && <p className="text-green-600 text-center">Message sent successfully!</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Message:</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>
          <button type="submit" className="w-full px-3 py-2 !bg-green-500 text-white rounded-md hover:!bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;