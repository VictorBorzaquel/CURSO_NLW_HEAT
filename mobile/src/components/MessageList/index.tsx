import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';
import io from 'socket.io-client'

import { styles } from './styles';
import { MESSAGES_EXAMPLE } from '../../utils/messages';

let messagesQueue: MessageProps[] = MESSAGES_EXAMPLE

const socket = io(String(api.defaults.baseURL))
socket.on('new_message', nemMessage => {
  messagesQueue.push(nemMessage)
})

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([])

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('messages/last3')
      setCurrentMessages(messagesResponse.data)
    }
    fetchMessages()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages(prev => [
          messagesQueue[0],
          prev[0],
          prev[1]
        ].filter(Boolean))

        messagesQueue.shift()
      }

      return () => clearInterval(timer)
    }, 3000)
  },[])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    > 
      {currentMessages.map(message => <Message key={message.id} data={message}/>)}
    </ScrollView>
  );
}
