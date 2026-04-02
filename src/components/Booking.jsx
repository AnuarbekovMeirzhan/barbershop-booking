import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Scissors, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Booking.css';

const Booking = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    barber: '',
    service: '',
    date: '',
    time: ''
  });
  const [isComplete, setIsComplete] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const STEPS = [
    { id: 1, title: t('booking.step1'), icon: User },
    { id: 2, title: t('booking.step2'), icon: Scissors },
    { id: 3, title: t('booking.step3'), icon: Calendar },
    { id: 4, title: t('booking.step4'), icon: Clock },
  ];

  const barbers = [t('booking.any_available'), t('barbers.b1_name'), t('barbers.b2_name'), t('barbers.b3_name')];
  const services = [t('services.s1_title'), t('services.s2_title'), t('services.s3_title'), t('services.s4_title')];
  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:00 PM"];

  useEffect(() => {
    const fetchBookedSlots = async () => {
      // Only query database when date and barber are selected and user is on time step
      if (step === 4 && selection.date && selection.barber) {
        setIsLoading(true);
        try {
          const q = query(
            collection(db, "appointments"),
            where("date", "==", selection.date),
            where("barber", "==", selection.barber)
          );
          const querySnapshot = await getDocs(q);
          const slots = [];
          querySnapshot.forEach((doc) => {
            slots.push(doc.data().time);
          });
          setBookedSlots(slots);
        } catch (error) {
          console.error("Error fetching slots:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchBookedSlots();
  }, [step, selection.date, selection.barber]);

  const handleSelect = (key, value) => {
    setSelection(prev => ({ ...prev, [key]: value }));
  };



  const nextStep = async () => {
    console.log("Button clicked. Current step:", step);
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        // Validation check for double-booking
        const checkQ = query(
          collection(db, "appointments"),
          where("date", "==", selection.date),
          where("barber", "==", selection.barber),
          where("time", "==", selection.time)
        );
        const checkSnapshot = await getDocs(checkQ);
        
        if (!checkSnapshot.empty) {
          alert(t('booking.error_double_booked') || "This time slot was just taken! Please select another time.");
          // Update local state to reflect the new booked slot
          setBookedSlots(prev => [...prev, selection.time]);
          setSelection(prev => ({ ...prev, time: '' }));
          setIsLoading(false);
          return;
        }

        await addDoc(collection(db, "appointments"), {
          barber: selection.barber,
          service: selection.service,
          date: selection.date,
          time: selection.time,
          createdAt: new Date().toISOString()
        });
        
        console.log("Calling Telegram API...");
        await fetch("/api/send-telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            barber: selection.barber,
            service: selection.service,
            date: selection.date,
            time: selection.time
          }),
        });
        console.log("Telegram API finished");
        
        setIsComplete(true);
      } catch (error) {
        console.error("Error saving booking:", error);
        alert(t('booking.error_save') || "Failed to confirm booking. Please try again or check your DB rules.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const reset = () => {
    setStep(1);
    setSelection({ barber: '', service: '', date: '', time: '' });
    setIsComplete(false);
    setBookedSlots([]);
  };

  return (
    <section className="section booking-section" id="booking">
      <div className="container">
        <div className="booking-container animate-fade-up">
          <div className="booking-header">
            <h2 className="booking-title">{t('booking.title')}</h2>
            <p className="booking-subtitle">{t('booking.subtitle')}</p>
          </div>

          {!isComplete ? (
            <div className="booking-body">
              <div className="booking-progress">
                {STEPS.map((s, idx) => (
                  <div key={s.id} className={`progress-step ${step >= s.id ? 'active' : ''}`}>
                    <div className="step-icon"><s.icon size={20} /></div>
                    <span className="step-title">{s.title}</span>
                    {idx < STEPS.length - 1 && <div className="step-line"></div>}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="step-content fade-in">
                  <h3>{t('booking.select_barber')}</h3>
                  <div className="options-grid">
                    {barbers.map(b => (
                      <button 
                        key={b} 
                        className={`option-btn ${selection.barber === b ? 'selected' : ''}`}
                        onClick={() => handleSelect('barber', b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content fade-in">
                  <h3>{t('booking.select_service')}</h3>
                  <div className="options-grid">
                    {services.map(s => (
                      <button 
                        key={s} 
                        className={`option-btn ${selection.service === s ? 'selected' : ''}`}
                        onClick={() => handleSelect('service', s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-content fade-in">
                  <h3>{t('booking.select_date')}</h3>
                  <input 
                    type="date" 
                    className="date-picker-ui" 
                    value={selection.date}
                    onChange={(e) => handleSelect('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              {step === 4 && (
                <div className="step-content fade-in">
                  <h3>{t('booking.select_time')}</h3>
                  {isLoading ? (
                    <div style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
                      <Loader2 size={32} className="success-icon" style={{ animation: 'spin 1.5s linear infinite' }} />
                    </div>
                  ) : (
                    <div className="options-grid slots-grid">
                      {timeSlots.map(tOption => {
                        const isBooked = bookedSlots.includes(tOption);
                        return (
                          <button 
                            key={tOption} 
                            disabled={isBooked}
                            className={`option-btn ${selection.time === tOption ? 'selected' : ''}`}
                            onClick={() => handleSelect('time', tOption)}
                            style={isBooked ? { opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#2a2a2a', color: '#666', borderColor: '#333' } : {}}
                          >
                            {tOption}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="booking-footer">
                {step > 1 && (
                  <button className="btn-outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
                    {t('booking.btn_back')}
                  </button>
                )}
                <button 
                  className="btn-primary" 
                  onClick={nextStep}
                  disabled={
                    isLoading ||
                    (step === 1 && !selection.barber) ||
                    (step === 2 && !selection.service) ||
                    (step === 3 && !selection.date) ||
                    (step === 4 && !selection.time)
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
                >
                  {isLoading && step === 4 ? <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> : null}
                  {step === 4 ? t('booking.btn_confirm') : t('booking.btn_continue')}
                </button>
              </div>
            </div>
          ) : (
            <div className="booking-success fade-in">
              <CheckCircle size={64} className="success-icon" />
              <h3>{t('booking.success_title')}</h3>
              <p>
                {t('booking.success_desc_1')} <strong>{selection.barber}</strong> {t('booking.success_desc_2')} <strong>{selection.service}</strong> {t('booking.success_desc_3')} <strong>{selection.date}</strong> {t('booking.success_desc_4')} <strong>{selection.time}</strong>.
              </p>
              <button className="btn-outline book-again" onClick={reset}>{t('booking.book_another')}</button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default Booking;
