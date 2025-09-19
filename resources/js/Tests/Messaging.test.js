/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageItem from '@/Components/Messaging/MessageItem';
import AttachmentPreview from '@/Components/Messaging/AttachmentPreview';

// Mock window.auth
window.auth = {
  user: {
    id: 1,
    name: 'Test User'
  }
};

// Mock route function
window.route = jest.fn((name, params) => {
  if (name === 'messaging.chat') {
    return `/messaging/${params.conversation}`;
  }
  return '/';
});

describe('Messaging Components', () => {
  describe('MessageItem', () => {
    const mockMessage = {
      id: 1,
      body: 'Hello, world!',
      type: 'text',
      user_id: 1,
      created_at: '2025-09-14T12:00:00Z',
      sender: {
        id: 1,
        name: 'Test User',
        profile_photo_url: null
      },
      attachments: []
    };

    test('renders text message correctly', () => {
      render(<MessageItem message={mockMessage} isOwn={true} />);
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });

    test('shows edited indicator when message is edited', () => {
      const editedMessage = {
        ...mockMessage,
        edited_at: '2025-09-14T12:05:00Z'
      };
      
      render(<MessageItem message={editedMessage} isOwn={true} />);
      expect(screen.getByText('(edited)')).toBeInTheDocument();
    });

    test('shows deleted message placeholder when message is deleted', () => {
      const deletedMessage = {
        ...mockMessage,
        deleted_at: '2025-09-14T12:10:00Z'
      };
      
      render(<MessageItem message={deletedMessage} isOwn={true} />);
      expect(screen.getByText('Message was deleted')).toBeInTheDocument();
    });
  });

  describe('AttachmentPreview', () => {
    test('renders image attachment correctly', () => {
      const imageAttachment = {
        id: 1,
        mime: 'image/jpeg',
        filename: 'test-image.jpg',
        size: 1024,
        human_size: '1 KB',
        url: 'https://example.com/test-image.jpg',
        width: 800,
        height: 600
      };
      
      render(<AttachmentPreview attachment={imageAttachment} />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/test-image.jpg');
      expect(img).toHaveAttribute('alt', 'test-image.jpg');
    });

    test('renders file attachment correctly', () => {
      const fileAttachment = {
        id: 1,
        mime: 'application/pdf',
        filename: 'test-document.pdf',
        size: 2048,
        human_size: '2 KB',
        url: 'https://example.com/test-document.pdf'
      };
      
      render(<AttachmentPreview attachment={fileAttachment} />);
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      expect(screen.getByText('2 KB')).toBeInTheDocument();
    });
  });
});
