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

<<<<<<< HEAD:frontend/supermarket_frontend/src/components/BackButton.js
export default BackButton;
=======
export default BackButton;
>>>>>>> bf2d68ecbca44751cd7d595479512e3b2e798a7b:frontend/src/components/BackButton.js
