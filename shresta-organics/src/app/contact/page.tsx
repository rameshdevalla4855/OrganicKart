'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import { Loader2, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // 1. Save to Firestore for record-keeping
      await addDoc(collection(db, 'contact_messages'), {
        name,
        mobile,
        message,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      // 2. Send Email Notification via API
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, mobile, message }),
      });

      setSuccess("Thank you! Your message has been safely sent to our team's inbox. We will get back to you shortly.");
      setName('');
      setMobile('');
      setMessage('');
    } catch (err: unknown) {
      console.error("Contact form error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send the message. Please try again later.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have questions about our organic process or want to track an order? Reach out directly!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-10 border border-gray-100">
          {success ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">{success}</p>
              <button 
                onClick={() => setSuccess('')} 
                className="mt-8 text-primary font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary outline-none transition-shadow resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-colors disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Send Message to Owner <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
