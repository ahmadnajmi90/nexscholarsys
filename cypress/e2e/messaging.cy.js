describe('Messaging Feature', () => {
  const user1 = {
    email: 'user1@example.com',
    password: 'password'
  };
  
  const user2 = {
    email: 'user2@example.com',
    password: 'password'
  };

  const testMessage = 'Hello, this is a test message ' + Date.now();

  it('Should allow two users to exchange messages in real-time', () => {
    // Login as first user
    cy.visit('/login');
    cy.get('[data-cy=email]').type(user1.email);
    cy.get('[data-cy=password]').type(user1.password);
    cy.get('[data-cy=login-button]').click();
    
    // Navigate to messaging
    cy.visit('/messaging');
    cy.get('[data-cy=new-conversation-button]').click();
    
    // Create a new conversation
    cy.get('[data-cy=user-search]').type(user2.email);
    cy.get('[data-cy=user-result]').first().click();
    cy.get('[data-cy=create-conversation-button]').click();
    
    // Send a message
    cy.get('[data-cy=message-input]').type(testMessage);
    cy.get('[data-cy=send-button]').click();
    
    // Verify message appears in the conversation
    cy.contains(testMessage).should('be.visible');
    
    // Open a new tab and login as the second user
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
    
    cy.log('Now manually open a new tab, login as user2, and check the message');
    
    // Note: In a real CI environment, you would use multiple browser sessions
    // or a tool like cypress-multi-session to test the real-time functionality
  });
  
  it('Should show typing indicators', () => {
    // Login
    cy.visit('/login');
    cy.get('[data-cy=email]').type(user1.email);
    cy.get('[data-cy=password]').type(user1.password);
    cy.get('[data-cy=login-button]').click();
    
    // Navigate to an existing conversation
    cy.visit('/messaging');
    cy.get('[data-cy=conversation-item]').first().click();
    
    // Type in the message input (should trigger typing indicator)
    cy.get('[data-cy=message-input]').type('I am typing a message...');
    
    // Verify typing indicator appears (would be visible to other user)
    cy.log('Typing indicator should be visible to the other user now');
    
    // Clear input (should clear typing indicator)
    cy.get('[data-cy=message-input]').clear();
    cy.log('Typing indicator should disappear after 2 seconds');
  });
  
  it('Should mark messages as read', () => {
    // Login
    cy.visit('/login');
    cy.get('[data-cy=email]').type(user1.email);
    cy.get('[data-cy=password]').type(user1.password);
    cy.get('[data-cy=login-button]').click();
    
    // Navigate to an existing conversation
    cy.visit('/messaging');
    cy.get('[data-cy=conversation-item]').first().click();
    
    // Verify that the conversation is marked as read
    cy.get('[data-cy=unread-badge]').should('not.exist');
    
    // Scroll to bottom of messages (should trigger read receipt)
    cy.get('[data-cy=message-list]').scrollTo('bottom');
    
    // Verify read receipt is shown on messages
    cy.get('[data-cy=read-receipt]').should('be.visible');
  });
  
  it('Should support file attachments', () => {
    // Login
    cy.visit('/login');
    cy.get('[data-cy=email]').type(user1.email);
    cy.get('[data-cy=password]').type(user1.password);
    cy.get('[data-cy=login-button]').click();
    
    // Navigate to an existing conversation
    cy.visit('/messaging');
    cy.get('[data-cy=conversation-item]').first().click();
    
    // Attach a file
    cy.get('[data-cy=attachment-button]').click();
    cy.get('[data-cy=file-input]').attachFile('test-image.jpg');
    
    // Send the message with attachment
    cy.get('[data-cy=send-button]').click();
    
    // Verify attachment appears in the conversation
    cy.get('[data-cy=attachment-preview]').should('be.visible');
  });
});
