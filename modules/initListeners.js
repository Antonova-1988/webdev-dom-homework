import { commentsGroup } from './commentsGroup.js'
import { renderComments } from './renderComments.js'
import { sanitizeHtml } from './sanitizeHtml.js'

export const initLikeListeners = (renderComments) => {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const index = likeButton.dataset.index
            const comment = commentsGroup[index]

            comment.likes = comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1
            comment.isLiked = !comment.isLiked

            renderComments()
        })
    }
}

export const initReplyListener = () => {
    const textInput = document.querySelector('.add-form-text')
    const commentElements = document.querySelectorAll('.comment')
    for (const commentElement of commentElements) {
        commentElement.addEventListener('click', () => {
            const commentIndex = commentElement.dataset.index
            const comment = commentsGroup[commentIndex]

            textInput.value = `> ${comment.name} : ${comment.text}\n\n`
            textInput.focus()
        })
    }
}

export const initAddCommentListener = (renderComments) => {
    const nameInput = document.querySelector('.add-form-name')
    const textInput = document.querySelector('.add-form-text')
    const addButton = document.querySelector('.add-form-button')

    addButton.addEventListener('click', () => {
        if (nameInput.value.trim() === '' || textInput.value.trim() === '') {
            return alert('Заполните все поля!')
        }

        const newComment = {
            name: sanitizeHtml(nameInput.value),
            date: new Date().toLocaleString(),
            text: sanitizeHtml(textInput.value),
            likes: 0,
            isLiked: false,
        }

        commentsGroup.push(newComment)

        renderComments()

        nameInput.value = ''
        textInput.value = ''
    })
}
renderComments()
