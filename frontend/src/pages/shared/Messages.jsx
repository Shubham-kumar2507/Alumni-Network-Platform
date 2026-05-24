import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageApi } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { Send, MessageSquare, Search } from 'lucide-react'
import toast from 'react-hot-toast'

function ChatList({ chats, selectedId, onSelect, search, onSearch }) {
  return (
    <div className="w-72 flex-shrink-0 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-base font-semibold text-white mb-3">Messages</h2>
        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input value={search} onChange={e => onSearch(e.target.value)} className="input-field search-input py-2 text-sm" placeholder="Search conversations..." />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.length ? chats.map(chat => {
          const other = chat.other_user
          const unread = chat.unread_count > 0
          const lastMsg = chat.latest_message || chat.last_message
          return (
            <button key={chat.id} onClick={() => onSelect(chat)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 transition-colors text-left ${selectedId === chat.id ? 'bg-slate-800' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {other?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${unread ? 'font-semibold text-white' : 'text-slate-300'}`}>{other?.name}</p>
                <p className="text-xs text-slate-500 truncate">{lastMsg?.body ?? 'No messages yet'}</p>
              </div>
              {unread && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
            </button>
          )
        }) : (
          <div className="text-center py-12 text-slate-500 text-sm px-4">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
            No conversations yet
          </div>
        )}
      </div>
    </div>
  )
}

export default function Messages() {
  const { user } = useAuth()
  const qc = useQueryClient()
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMsg, setNewMsg] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef(null)

  const { data: chatsData, isLoading: chatsLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => messageApi.chats().then(r => r.data),
    refetchInterval: 5000,
  })

  const { data: messagesData } = useQuery({
    queryKey: ['messages', selectedChat?.id],
    queryFn: () => messageApi.messages(selectedChat.id).then(r => r.data),
    enabled: !!selectedChat?.id,
    refetchInterval: 3000,
  })

  const sendMut = useMutation({
    mutationFn: ({ chatId, body }) => messageApi.send(chatId, { body }),
    onSuccess: () => {
      qc.invalidateQueries(['messages', selectedChat?.id])
      qc.invalidateQueries(['chats'])
    },
    onError: () => toast.error('Failed to send message'),
  })

  // chatsData is { data: [...] }
  const chats = chatsData?.data ?? []
  // messagesData is { data: [...] }
  const messages = messagesData?.data ?? []

  const filteredChats = chats.filter(c =>
    c.other_user?.name?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!newMsg.trim() || !selectedChat) return
    sendMut.mutate({ chatId: selectedChat.id, body: newMsg.trim() })
    setNewMsg('')
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] card overflow-hidden">
      <ChatList
        chats={filteredChats}
        selectedId={selectedChat?.id}
        onSelect={setSelectedChat}
        search={search}
        onSearch={setSearch}
      />

      {selectedChat ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {selectedChat.other_user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{selectedChat.other_user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{selectedChat.other_user?.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 text-sm py-8">
                No messages yet. Say hello! 👋
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.sender_id === user?.id
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm'}`}>
                    {msg.body}
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-800 flex gap-3 flex-shrink-0">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              className="input-field flex-1"
              placeholder="Type a message..."
            />
            <button
              onClick={send}
              disabled={!newMsg.trim() || sendMut.isPending}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a conversation to start chatting</p>
            {chatsLoading && <p className="text-xs mt-2 text-slate-600">Loading chats...</p>}
          </div>
        </div>
      )}
    </div>
  )
}
