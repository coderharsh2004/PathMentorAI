"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import EmptyState from '../_components/EmptyState'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';

type messages = {
    content: string,
    role: string,
    type: string
}

function AiChat() {
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageList] = useState<messages[]>([]);
    const { chatid }: any = useParams();
    const router = useRouter();

    useEffect(() => {
        chatid && GetMessageList();
    }, [chatid]);

    const GetMessageList = async () => {
        const result = await axios.get('/api/history?recordId=' + chatid);
        console.log(result.data);
        // ✅ Always fallback to [] if undefined
        setMessageList(result?.data?.content ?? []);
    };

    const onSend = async () => {
        if (!userInput.trim()) return;

        setLoading(true);
        setMessageList(prev => [
            ...prev,
            {
                content: userInput,
                role: 'user',
                type: 'text'
            }
        ]);
        setUserInput('');

        try {
            const result = await axios.post('/api/ai-career-chat-agent', {
                userInput: userInput
            });
            console.log(result.data);
            setMessageList(prev => [...prev, result.data]);
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // ✅ Only run if messageList is an array with items
        if (Array.isArray(messageList) && messageList.length > 0) {
            updateMessageList();
        }
    }, [messageList]);

    const updateMessageList = async () => {
        try {
            const result = await axios.put('/api/history', {
                content: messageList,
                recordId: chatid
            });
            console.log(result);
        } catch (err) {
            console.error("Error updating message list:", err);
        }
    };

    const onNewChat = async () => {
        const id = uuidv4();

        try {
            // Create New record to History Table
            const result = await axios.post('/api/history', {
                recordId: id,
                content: []
            });
            console.log(result);
            router.replace("/ai-tools/ai-chat/" + id);
        } catch (err) {
            console.error("Error creating new chat:", err);
        }
    };

    return (
        <div className='px-10 md:px-24 lg:px-36 xl:px-48 h-[75vh] '>
            <div className='flex items-center justify-between gap-8'>
                <div>
                    <h2 className='font-bold text-lg'>AI Career Q/A Chat</h2>
                    <p>Smarter career decisions start here — get tailored advice, real-time market insights</p>
                </div>
                <Button onClick={onNewChat}>+ New Chat</Button>
            </div>

            <div className='flex flex-col h-[70vh] overflow-auto '>
                {messageList?.length <= 0 && (
                    <div className='mt-5'>
                        {/* Empty State Options */}
                        <EmptyState selectedQuestion={(question: string) => setUserInput(question)} />
                    </div>
                )}

                <div className='flex-1 mt-8'>
                    {/* Message List */}
                    {messageList?.map((message, index) => (
                        <div key={index}>
                            <div className={`flex mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg gap-2 ${message.role === 'user'
                                    ? 'bg-gray-200 text-black rounded-lg'
                                    : "bg-gray-50 text-black"
                                    }`}>
                                    {message.content}
                                </div>
                            </div>
                            {loading && messageList?.length - 1 === index && (
                                <div className='flex justify-start p-3 rounded-lg gap-2 bg-gray-50 text-black mb-2'>
                                    <LoaderCircle className='animate-spin' /> Thinking...
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className='flex justify-between items-center gap-6 absolute bottom-5 w-[50%]'>
                    {/* Input Field */}
                    <Input
                        placeholder='Type here'
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                    />
                    <Button onClick={onSend} disabled={loading}>
                        <Send />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AiChat;
