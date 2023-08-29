module.exports = (diff, posts, i) => {
  if (diff < 60) {
    posts[i].date = `${Math.floor(diff)}초 전`;
  } else if (diff < 3600) {
    posts[i].date = `${Math.floor(diff / 60)}분 전`;
  } else if (diff < 86400) {
    posts[i].date = `${Math.floor(diff / 3600)}시간 전`;
  } else if (diff < 604800) {
    posts[i].date = `${Math.floor(diff / 86400)}일 전`;
  } else if (diff < 2592000) {
    posts[i].date = `${Math.floor(diff / 604800)}주 전`;
  } else if (diff < 31536000) {
    posts[i].date = `${Math.floor(diff / 2592000)}달 전`;
  } else {
    posts[i].date = `${Math.floor(diff / 31536000)}년 전`;
  }
};
