export const sanitizeHtml = (value) => {
    return value.replace('<', '&lt;').replace('>', '&gt;')
}
