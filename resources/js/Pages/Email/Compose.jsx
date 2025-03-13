import React from 'react';
import { useForm } from '@inertiajs/react';

const Compose = ({ receiver }) => {
  const { data, setData, post, processing, errors } = useForm({
    receiver_id: receiver.id,
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('email.send'));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Send Email to {receiver.name}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Subject</label>
          <input
            type="text"
            name="subject"
            value={data.subject}
            onChange={(e) => setData('subject', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.subject && (
            <div className="text-red-600 text-sm">{errors.subject}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-medium">Message</label>
          <textarea
            name="message"
            value={data.message}
            onChange={(e) => setData('message', e.target.value)}
            className="w-full p-2 border rounded"
            rows="5"
          ></textarea>
          {errors.message && (
            <div className="text-red-600 text-sm">{errors.message}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {processing ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Compose;
