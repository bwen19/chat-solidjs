const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const twoDigits = (n: number): string => {
  return n >= 10 ? `${n}` : `0${n}`;
};

export const fmtDividerDate = (dt: Date): string => {
  const now = new Date();
  const date = new Date(dt);

  const sendTime = `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;

  if (now.getFullYear() > date.getFullYear()) {
    return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())} ${sendTime}`;
  } else if (now.getMonth() > date.getMonth()) {
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${sendTime}`;
  } else {
    const days = now.getDate() - date.getDate();
    if (days === 0) {
      return `Today ${sendTime}`;
    } else if (days === 1) {
      return `Yesterday ${sendTime}`;
    } else {
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${sendTime}`;
    }
  }
};

export const fmtLastDate = (dt: Date): string => {
  const now = new Date();
  const date = new Date(dt);

  if (now.getFullYear() > date.getFullYear()) {
    return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
  } else if (now.getMonth() > date.getMonth()) {
    return `${monthShortNames[date.getMonth()]} ${date.getDate()}`;
  } else {
    const days = now.getDate() - date.getDate();
    if (days === 0) {
      return `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return `${monthShortNames[date.getMonth()]} ${date.getDate()}`;
    }
  }
};

export const fmtDate = (dt: Date): string => {
  const date = new Date(dt);
  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
};
