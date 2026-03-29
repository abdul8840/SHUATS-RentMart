import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkStatusAPI } from '../../api/axios.js';

const PendingApproval = () => {
  const [status, setStatus] = useState('pending');
  const [reason, setReason] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await checkStatusAPI();
        setStatus(data.accountStatus);
        setReason(data.rejectionReason || '');
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  return (
    <div>
      <div>
        {status === 'pending' ? (
          <>
            <div>⏳</div>
            <h2>Your account is pending approval</h2>
            <p>Our admin team is reviewing your student ID card. You will be notified via email once your account is approved.</p>
            <p>This usually takes 24-48 hours.</p>
          </>
        ) : status === 'rejected' ? (
          <>
            <div>❌</div>
            <h2>Your account has been rejected by the administrator</h2>
            {reason && <p>Reason: {reason}</p>}
            <p>If you believe this is an error, please contact the administration.</p>
          </>
        ) : null}

        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default PendingApproval;