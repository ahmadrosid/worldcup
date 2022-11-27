import { useEffect, useState } from 'react';

const useCountdown = (targetDate) => {
    const diff = 45;
    let countDownDate = new Date(targetDate).getTime() + diff * 60000;

    const [countDown, setCountDown] = useState(
        new Date(countDownDate).getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(targetDate + new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDownDate]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
    // calculate time left
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [days, hours, minutes, seconds];
};

export { useCountdown };
