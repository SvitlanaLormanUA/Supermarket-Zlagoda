import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <button onClick={handleBackClick} className="back-button">
            <img src="/assets/images/back.png" alt="Back" className="back-icon" />
            <style jsx>{`
        .back-button {
          background: none;
          border: none;
          padding: 10px;
          cursor: pointer;
        }

        .back-icon {
          width: 30px;
          height: 30px;
        }

        .back-button:hover .back-icon {
          opacity: 0.7;
        }
      `}</style>
        </button>
    );
}

export default BackButton;
