import React, { useState } from 'react';
import { Stack, TextField, PrimaryButton } from '@fluentui/react';
import { SendRegular } from '@fluentui/react-icons';
import Send from '../../assets/Send.svg';
import styles from './QuestionInput.module.css';

interface Props {
  onSend: (question: string, id?: string) => void;
  disabled: boolean;
  placeholder?: string;
  clearOnSend?: boolean;
  conversationId?: string;
  updateQuestion: (newQuestion: string) => void; // Add this line
}

export const QuestionInput = ({
  onSend,
  disabled,
  placeholder,
  clearOnSend,
  conversationId,
  updateQuestion,
}: Props) => {
  const [question, setQuestion] = useState<string>('');

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return;
    }

    if (conversationId) {
      onSend(question, conversationId);
    } else {
      onSend(question);
    }

    if (clearOnSend) {
      setQuestion('');
    }
  };

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault();
      sendQuestion();
    }
  };

  const onQuestionChange = (
    _ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string,
  ) => {
    setQuestion(newValue || '');
  };

  const updateQuestionToExample = () => {
    setQuestion('Write me a job description for a');
  };

  const sendQuestionDisabled = disabled || !question.trim();

  return (
    <Stack horizontal className={styles.questionInputContainer}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      <div className={styles.questionInputSendButtonContainer}>
        <PrimaryButton onClick={updateQuestionToExample}>Example</PrimaryButton>
        <PrimaryButton onClick={sendQuestion} style={{ marginLeft: '10px' }}>Send</PrimaryButton>
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  );
};
