export const fmtSendTime = (dt: Date) => {
  const date = new Date(dt);
  return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
};

export const fmtDividerDate = (dt: Date, today: Date): string => {
  const date = new Date(dt);
  const weekday = ["日", "一", "二", "三", "四", "五", "六"][date.getDay()];

  if (today.getFullYear() > date.getFullYear()) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日 星期${weekday}`;
  } else if (today.getMonth() > date.getMonth()) {
    return `${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日 星期${weekday}`;
  } else {
    const days = today.getDate() - date.getDate();
    if (days === 0) {
      return `今天 星期${weekday}`;
    } else if (days === 1) {
      return `昨天 星期${weekday}`;
    } else {
      return `${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日 星期${weekday}`;
    }
  }
};

export const fmtLastDate = (dt: Date, today: Date): string => {
  const date = new Date(dt);
  if (today.getFullYear() > date.getFullYear()) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日`;
  } else if (today.getMonth() > date.getMonth()) {
    return `${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日`;
  } else {
    const days = today.getDate() - date.getDate();
    if (days === 0) {
      return `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
    } else if (days === 1) {
      return "昨天";
    } else {
      return `${date.getMonth() + 1}月${("0" + date.getDate()).slice(-2)}日`;
    }
  }
};

export const fmtDate = (dt: Date): string => {
  const date = new Date(dt);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${("0" + date.getDate()).slice(-2)}`;
};

export const todayEndTime = (): Date => {
  return new Date(new Date().setHours(23, 59, 59, 999));
};
