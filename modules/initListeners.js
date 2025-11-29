import { postComment } from './api.js'
import { comments, updateComments } from './commentsGroup.js'
import { sanitizeHtml } from './sanitizeHtml.js'

// export const initLikeListeners = (renderComments) => {
//     const likeButtons = document.querySelectorAll('.like-button')

//     for (const likeButton of likeButtons) {
//         likeButton.addEventListener('click', (event) => {
//             event.stopPropagation()
//             const index = likeButton.dataset.index
//             const comment = comments[index]

//             comment.likes = comment.isLiked
//                 ? comment.likes - 1
//                 : comment.likes + 1
//             comment.isLiked = !comment.isLiked

//             renderComments()
//         })
//     }
// }

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

export const initLikeListeners = (renderComments) => {
    const likeButtons = document.querySelectorAll('.like-button')

    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', async (event) => {
            event.stopPropagation()
            const index = likeButton.dataset.index
            const comment = comments[index]

            // Добавляем класс для анимации
            likeButton.classList.add('-loading-like')

            // Обработчик окончания анимации
            const handleAnimationEnd = () => {
                likeButton.classList.remove('-loading-like')
                likeButton.removeEventListener(
                    'animationend',
                    handleAnimationEnd,
                )
            }

            likeButton.addEventListener('animationend', handleAnimationEnd)

            // Имитация задержки, чтобы было видно анимацию
            await delay(300) // подходящее время задержки

            // Обновляем лайки
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
            const comment = comments[commentIndex]

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

        document.querySelector('.form-loading').style.display = 'block'
        document.querySelector('.add-form').style.display = 'none'

        postComment(
            sanitizeHtml(textInput.value),
            sanitizeHtml(nameInput.value),
        )
            .then((data) => {
                document.querySelector('.form-loading').style.display = 'none'
                document.querySelector('.add-form').style.display = 'flex'

                updateComments(data)
                renderComments()
                nameInput.value = ''
                textInput.value = ''
            })
            .catch((error) => {
                document.querySelector('.form-loading').style.display = 'none'
                document.querySelector('.add-form').style.display = 'flex'

                if (error.message === 'Failed to fetch') {
                    alert('Кажется, у вас сломался интернет, попробуйте позже')
                }

                if (error.message === 'Ошибка сервера') {
                    alert('Ошибка сервера')
                }

                if (error.message === 'Неверный запрос') {
                    alert('Имя и комментарий должны быть не короче 3 символов')

                    nameInput.classList.add('.error')
                    textInput.classList.add('.error')

                    setTimeout(() => {
                        nameInput.classList.remove('.error')
                        textInput.classList.remove('.error')
                    }, 2000)
                }
            })
    })
}
