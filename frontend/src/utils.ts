import { AlertProps } from './interfaces';

export const showAlert = ({
  msg,
  zIndex = '0',
  duration = 4000,
  textColor = '#fff',
  bgColor = '#181818',
}: AlertProps) => {
  const alert = document.querySelector('#alert') as HTMLElement;

  // show alert only when alert box is initially hidden
  if (alert.style.bottom === '-150px') {
    alert.style.background = bgColor;
    alert.style.color = textColor;
    alert.innerHTML = msg;
    alert.style.bottom = '0px';

    if (zIndex !== '0') alert.style.zIndex = zIndex;

    setTimeout(() => {
      alert.style.bottom = '-150px';
    }, duration);
  }
};
