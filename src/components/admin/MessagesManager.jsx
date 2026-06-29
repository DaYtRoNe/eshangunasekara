import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Trash2, CheckCircle2, Inbox, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to Date for display, handle pending writes
        date: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
      }));
      setMessages(msgs);
      setLoading(false);
      
      // Update selected message if it was changed
      if (selectedMessage) {
        const updatedSelected = msgs.find(m => m.id === selectedMessage.id);
        if (updatedSelected) {
          setSelectedMessage(updatedSelected);
        } else {
          setSelectedMessage(null); // It was deleted
        }
      }
    }, (error) => {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    // Mark as read automatically when opened
    if (msg.unread) {
      try {
        await updateDoc(doc(db, 'messages', msg.id), {
          unread: false
        });
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this message?")) {
      const toastId = toast.loading('Deleting message...');
      try {
        await deleteDoc(doc(db, 'messages', id));
        toast.success('Message deleted successfully', { id: toastId });
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error('Failed to delete message', { id: toastId });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold font-outfit text-white flex items-center gap-3">
            <Inbox className="w-8 h-8 text-primary" />
            Inbox
          </h2>
          <p className="text-gray-400 mt-1">Manage messages received from your contact form.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        
        {/* Messages List */}
        <div className="lg:col-span-1 glass-card rounded-2xl border border-white/5 flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-white/5 bg-dark-800/50 flex-shrink-0">
            <h3 className="font-semibold text-white">All Messages</h3>
          </div>
          
          <div className="overflow-y-auto flex-grow p-2 space-y-2 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Inbox className="w-12 h-12 mb-3 opacity-20" />
                <p>No messages yet.</p>
              </div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedMessage?.id === msg.id 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-dark-900 border-transparent hover:border-white/10'
                  } ${msg.unread ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium truncate pr-2 ${msg.unread ? 'text-white' : 'text-gray-300'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {msg.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate mb-2 ${msg.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                    {msg.subject}
                  </p>
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => handleDelete(msg.id, e)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-white/5 bg-dark-800/50 flex-shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-primary">{selectedMessage.name}</span>
                      <span className="text-gray-500">•</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-gray-400 hover:text-white transition-colors">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedMessage.date.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
              <Mail className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Select a message to read</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessagesManager;
