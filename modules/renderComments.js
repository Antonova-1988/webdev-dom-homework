import { comments } from './commentsGroup.js'
import { initLikeListeners, initReplyListener } from './initListeners.js'

export const renderComments = () => {
    const commentHtml = document.querySelector('.comments')

    commentHtml.innerHTML = comments
        .map((comment, index) => {
            return `
    <li data-index="${index}" class="comment">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${comment.isLiked ? '-active-like' : ''}"></button>
          </div>
        </div>
      </li>`
        })
        .join('')

    initLikeListeners(renderComments)
    initReplyListener()
}
