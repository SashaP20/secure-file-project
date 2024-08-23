import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Simple Site Tests', () => {

  test('renders home page', () => {
    render(<App />);
    // Assuming the home page has a title like "Welcome to the Secure File Storage System"
    expect(screen.getByText('Welcome to the Secure File Storage System')).toBeInTheDocument();
  });

  test('shows "Log In" button if user is not connected', () => {
    render(<App />);
    // Assuming there's a "Log In" button when user is not connected
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('does not show "Manage Files" button if user is not connected', () => {
    render(<App />);
    // Assuming "Manage Files" button should not be visible when user is not connected
    expect(screen.queryByText('Manage Files')).not.toBeInTheDocument();
  });
});
