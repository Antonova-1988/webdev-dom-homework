import { initAddCommentListener } from './modules/initListeners.js'
import { renderComments } from './modules/renderComments.js'

renderComments()

initAddCommentListener(renderComments)
