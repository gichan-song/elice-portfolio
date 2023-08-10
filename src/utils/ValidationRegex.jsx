export const regexEmail =
  /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

export const regexNickname = /^[a-z0-9A-Z_.가-힣]{2,}$/;

export const regexPassword = /^(?=.*[a-zA-Z0-9@!#$%^&*()\-_=+\\|[\]{};:'",<.>/?`~]).{6,14}$/;
