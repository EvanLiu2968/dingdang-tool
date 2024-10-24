/**
 * refactor clipboard.js
 */
export function select(element) {
  var selectedText

  if (element.nodeName === 'SELECT') {
    element.focus()

    selectedText = element.value
  } else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
    var isReadOnly = element.hasAttribute('readonly')

    if (!isReadOnly) {
      element.setAttribute('readonly', '')
    }

    element.select()
    element.setSelectionRange(0, element.value.length)

    if (!isReadOnly) {
      element.removeAttribute('readonly')
    }

    selectedText = element.value
  } else {
    if (element.hasAttribute('contenteditable')) {
      element.focus()
    }

    var selection = window.getSelection()
    var range = document.createRange()

    range.selectNodeContents(element)
    selection.removeAllRanges()
    selection.addRange(range)

    selectedText = selection.toString()
  }

  return selectedText
}

export function copyText(text) {
  const action = 'copy'
  return new Promise((resolve, reject) => {
    const isRTL = document.documentElement.getAttribute('dir') == 'rtl'

    const fakeElem = document.createElement('textarea')
    // Prevent zooming on iOS
    fakeElem.style.fontSize = '12pt'
    // Reset box model
    fakeElem.style.border = '0'
    fakeElem.style.padding = '0'
    fakeElem.style.margin = '0'
    // Move element out of screen horizontally
    fakeElem.style.position = 'absolute'
    fakeElem.style[ isRTL ? 'right' : 'left' ] = '-9999px'
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop
    fakeElem.style.top = `${yPosition}px`

    fakeElem.setAttribute('readonly', '')
    fakeElem.value = text

    document.body.appendChild(fakeElem)

    const selectedText = select(fakeElem)
    try {
      document.execCommand(action)

      document.activeElement.blur()
      window.getSelection().removeAllRanges()

      document.body.removeChild(fakeElem)

      resolve({
        action,
        text: selectedText
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function copyDom(dom) {
  const action = 'copy'
  return new Promise((resolve, reject) => {
    const isRTL = document.documentElement.getAttribute('dir') == 'rtl'

    const fakeElem = document.createElement('div')
    // Move element out of screen horizontally
    fakeElem.style.position = 'absolute'
    fakeElem.style[ isRTL ? 'right' : 'left' ] = '-9999px'
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || document.documentElement.scrollTop
    fakeElem.style.top = `${yPosition}px`

    if (dom) {
      if (Array.isArray(dom)) {
        dom.forEach(d => {
          fakeElem.appendChild(d)
        })
      } else {
        fakeElem.appendChild(dom)
      }
    }

    document.body.appendChild(fakeElem)
    fakeElem.focus()

    var selection = window.getSelection()
    var range = document.createRange()

    range.selectNodeContents(fakeElem)
    selection.removeAllRanges()
    selection.addRange(range)
    try {
      document.execCommand(action)

      document.activeElement.blur()
      window.getSelection().removeAllRanges()

      document.body.removeChild(fakeElem)

      resolve({
        action,
        dom
      })
    } catch (err) {
      reject(err)
    }
  })
}

function getLoadedImage(src) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (err) => {
      reject(err)
    }
    img.setAttribute('src', src)
  })
}

export function copyImage(src) {
  if (!Array.isArray(src)) {
    src = [src]
  }
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function(resolve, reject) {
    try {
      const dom = []
      for (let i = 0; i < src.length; i++) {
        const img = await getLoadedImage(src[i])
        dom.push(img)
      }

      const { action } = await copyDom(dom)
      resolve({
        action,
        imgs: src
      })
    } catch (err) {
      reject(err)
    }
  })
}

