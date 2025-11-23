const host = 'https://wedev-api.sky.pro/api/v1/valentina-antonova'
export const fetchComments = () => {
    return fetch(host + '/comments')
        .then((res) => {
            return res.json()
        })
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleString(),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            })
            return appComments
        })
}

const maxRetriers = 3
const addButton = document.querySelector('.add-form-button')
const nameInput = document.querySelector('.add-form-name')
const textInput = document.querySelector('.add-form-text')

export const postComment = (text, name, retriers = maxRetriers) => {
    return fetch(host + '/comments', {
        method: 'POST',
        body: JSON.stringify({
            text,
            name,
            forceError: true,
        }),
    })
        .then((response) => {
            if (response.status === 201) {
                return response.json()
            } else {
                if (response.status === 500) {
                    if (retriers > 0) {
                        return new Promise((resolve) =>
                            setTimeout(resolve, 1000),
                        ).then(() => {
                            return postComment(text, name, retriers - 1)
                        })
                    } else {
                        throw new Error('Ошибка сервера')
                    }
                }

                if (response.status === 400) {
                    throw new Error('Неверный запрос')
                }

                throw new Error('Что-то пошло не так')
            }
        })
        .then(() => {
            return fetchComments()
        })
}