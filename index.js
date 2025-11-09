import { initAddCommentListener } from './modules/initListeners.js'
import { renderComments } from './modules/renderComments.js'
import { fetchComments } from './modules/api.js'
import { updateComments } from './modules/commentsGroup.js'

fetchComments().then((data) => {
    updateComments(data)
    renderComments()
})

renderComments()

initAddCommentListener(renderComments)
