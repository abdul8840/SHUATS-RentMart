import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkStatusAPI } from '../../api/axios.js';
import {
  FiClock, FiXCircle, FiArrowLeft, FiMail,
  FiCheckCircle, FiRefreshCw
} from 'react-icons/fi';

const PendingApproval = () => {
  const [status, setStatus]     = useState('pending');
  const [reason, setReason]     = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => { checkStatus(); }, []);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await checkStatusAPI();
        setStatus(data.accountStatus);
        setReason(data.rejectionReason || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const isPending  = status === 'pending';
  const isRejected = status === 'rejected';

  return (
    <div className="min-h-screen bg-[var(--color-cream-light)] flex items-center justify-center p-4">

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`
          absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-soft
          ${isPending ? 'bg-amber-200' : 'bg-red-200'}
        `} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-mint-light)] opacity-30 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">

        {/* Card */}
        <div className="
          bg-[var(--color-cream-light)]/90 backdrop-blur-xl
          rounded-3xl shadow-2xl shadow-black/10
          border border-[var(--color-rose-beige)]/50
          overflow-hidden
        ">
          {/* Top accent */}
          <div className={`h-1.5 w-full ${isPending ? 'gradient-bg' : 'bg-gradient-to-r from-red-400 to-red-600'}`} />

          <div className="p-8 text-center">

            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-xl shadow-md animate-bounce-soft">📚</div>
              <span className="text-lg font-extrabold gradient-text">SHUATS RentMart</span>
            </div>

            {/* Status icon */}
            {isPending ? (
              <div className="flex flex-col items-center gap-4 mb-6 animate-slide-down">
                <div className="relative">
                  <div className="
                    w-24 h-24 rounded-3xl bg-amber-100
                    flex items-center justify-center
                    shadow-lg shadow-amber-500/20
                  ">
                    <FiClock size={44} className="text-amber-500" />
                  </div>
                  {/* Spinning ring */}
                  <div className="
                    absolute inset-0 rounded-3xl border-4 border-amber-300 border-t-amber-500
                    animate-spin opacity-50
                  " />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                    Account Under Review
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    Our admin team is verifying your SHUATS Student ID card.
                    You'll receive an email once approved.
                  </p>
                </div>

                {/* Timeline steps */}
                <div className="w-full space-y-3 text-left mt-2">
                  {[
                    { icon: <FiCheckCircle size={16} />, label: 'Registration submitted', done: true },
                    { icon: <FiClock size={16} />, label: 'ID card under review', done: false, active: true },
                    { icon: <FiMail size={16} />, label: 'Approval email will be sent', done: false },
                  ].map((step, i) => (
                    <div key={i} className={`
                      flex items-center gap-3 p-3 rounded-xl border
                      ${step.done ? 'bg-emerald-50 border-emerald-200' :
                        step.active ? 'bg-amber-50 border-amber-200' :
                        'bg-[var(--color-cream)] border-[var(--color-rose-beige)]/50'
                      }
                    `}>
                      <span className={`
                        flex-shrink-0
                        ${step.done ? 'text-emerald-500' :
                          step.active ? 'text-amber-500 animate-pulse-soft' :
                          'text-gray-300'
                        }
                      `}>
                        {step.icon}
                      </span>
                      <span className={`text-sm font-medium
                        ${step.done ? 'text-emerald-700' :
                          step.active ? 'text-amber-700' :
                          'text-gray-400'
                        }
                      `}>
                        {step.label}
                      </span>
                      {step.active && (
                        <div className="ml-auto flex gap-1">
                          {[0,1,2].map(i => (
                            <div key={i} style={{ animationDelay: `${i*200}ms` }}
                              className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce-soft" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* ETA */}
                <div className="
                  w-full flex items-center gap-2 px-4 py-3 rounded-2xl
                  bg-[var(--color-mint-light)] border border-[var(--color-mint)]/40
                ">
                  <FiClock size={14} className="text-[var(--color-forest)] flex-shrink-0" />
                  <p className="text-xs text-[var(--color-forest-dark)]">
                    ⏳ Estimated approval time: <strong>24–48 hours</strong>
                  </p>
                </div>
              </div>
            ) : isRejected ? (
              <div className="flex flex-col items-center gap-4 mb-6 animate-slide-down">
                <div className="
                  w-24 h-24 rounded-3xl bg-red-100
                  flex items-center justify-center
                  shadow-lg shadow-red-500/20
                  animate-bounce-soft
                ">
                  <FiXCircle size={44} className="text-red-500" />
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
                    Account Rejected
                  </h2>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    Unfortunately, your account registration was not approved by the administrator.
                  </p>
                </div>

                {reason && (
                  <div className="
                    w-full p-4 rounded-2xl bg-red-50
                    border border-red-200 text-left
                    animate-scale-in
                  ">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700">{reason}</p>
                  </div>
                )}

                <div className="
                  w-full p-4 rounded-2xl
                  bg-[var(--color-mint-light)] border border-[var(--color-mint)]/40
                  text-left
                ">
                  <p className="text-xs font-semibold text-[var(--color-forest)] mb-1">Need help?</p>
                  <p className="text-xs text-gray-600">
                    Contact us at{' '}
                    <a href="mailto:support@shuats.com" className="text-[var(--color-forest)] font-semibold hover:underline cursor-pointer">
                      support@shuats.com
                    </a>
                  </p>
                </div>
              </div>
            ) : null}

            {/* Refresh + Back */}
            <div className="flex flex-col gap-3">
              {isPending && (
                <button
                  onClick={checkStatus}
                  disabled={checking}
                  className="
                    flex items-center justify-center gap-2 w-full
                    py-3 rounded-xl text-sm font-semibold
                    bg-[var(--color-mint-light)] text-[var(--color-forest)]
                    border border-[var(--color-mint)]/40
                    hover:bg-[var(--color-mint)] hover:scale-[1.02]
                    active:scale-[0.98] cursor-pointer
                    transition-all duration-200
                    disabled:opacity-60
                  "
                >
                  <FiRefreshCw size={15} className={checking ? 'animate-spin' : ''} />
                  {checking ? 'Checking…' : 'Refresh Status'}
                </button>
              )}

              <Link
                to="/login"
                className="
                  flex items-center justify-center gap-2 w-full
                  py-3 rounded-xl text-sm font-semibold
                  text-gray-600 bg-[var(--color-cream)]
                  border border-[var(--color-rose-beige)]/60
                  hover:bg-[var(--color-rose-beige)]/30
                  cursor-pointer transition-all duration-200
                "
              >
                <FiArrowLeft size={15} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          📧 Check your spam folder if you don't see our email
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;