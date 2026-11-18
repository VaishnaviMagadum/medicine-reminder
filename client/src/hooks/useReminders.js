import { useEffect, useState, useRef } from 'react';

const useReminders = (medicines) => {
  const [activeReminder, setActiveReminder] = useState(null);
  const checkedRef = useRef(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(med => {
        const key = `${med.id}-${currentTime}`;
        if (med.reminderTime === currentTime && !checkedRef.current.has(key)) {
          setActiveReminder(med);
          checkedRef.current.add(key);
          
          // Browser Notification
          if (Notification.permission === 'granted') {
            new Notification(`Time to take ${med.name}`, {
              body: `${med.dosage} - ${med.mealType}`,
              icon: '/vite.svg'
            });
          }
        }
      });

      // Cleanup old keys from the set
      if (checkedRef.current.size > 100) checkedRef.current.clear();
      
    }, 10000);

    return () => clearInterval(interval);
  }, [medicines]);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { activeReminder, setActiveReminder };
};

export default useReminders;
