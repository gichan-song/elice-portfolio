import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, open]);

  const showSnackbar = (msg, dur = 3000) => {
    setMessage(msg);
    setDuration(dur);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
  };

  const SnackbarComponent = () => <SnackbarContainer open={open}>{message}</SnackbarContainer>;

  return { showSnackbar, SnackbarComponent, closeSnackbar };
};

export default useSnackbar;

const SnackbarContainer = styled.div`
  position: fixed;
  bottom: 7rem;
  left: 50%;
  transform: translateX(-50%);
  background: #333333;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: var(--fs-sm);
  padding: 1rem 2rem;
  border-radius: 1rem;
  display: ${({ open }) => (open ? 'block' : 'none')};
  z-index: 500;
`;
