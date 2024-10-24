/**
 * 转义html
 */
function trim(str) {
  if (String.prototype.trim) {
    return str.trim()
  }
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
function spaceIndex(str) {
  var reg = /\s|\n|\t/
  var match = reg.exec(str)
  return match ? match.index : -1
}
function getTagName(html) {
  const i = spaceIndex(html)
  let tagName = html.slice(1, i + 1)
  if (i === -1) {
    tagName = html.slice(1, -1)
  }
  tagName = trim(tagName).toLowerCase()
  if (tagName.slice(0, 1) === '/') tagName = tagName.slice(1)
  if (tagName.slice(-1) === '/') tagName = tagName.slice(0, -1)
  return tagName
}
function isClosing(html) {
  return html.slice(0, 2) === '</'
}

const REGEXP_LT = /</g
const REGEXP_GT = />/g

function escapeHtml(html) {
  return html.replace(REGEXP_LT, '&lt;').replace(REGEXP_GT, '&gt;')
}
function onTag(tag, html, isClosing) {
  // do nothing
  return escapeHtml(html)
}
function parseTag(html) {
  'use strict'

  let rethtml = ''
  let lastPos = 0
  let tagStart = false
  let quoteStart = false
  let currentPos = 0
  const len = html.length
  let currentTagName = ''
  let currentHtml = ''

  for (currentPos = 0; currentPos < len; currentPos++) {
    const c = html.charAt(currentPos)
    if (tagStart === false) {
      if (c === '<') {
        tagStart = currentPos
        continue
      }
    } else {
      if (quoteStart === false) {
        if (c === '<') {
          rethtml += escapeHtml(html.slice(lastPos, currentPos))
          tagStart = currentPos
          lastPos = currentPos
          continue
        }
        if (c === '>') {
          rethtml += escapeHtml(html.slice(lastPos, tagStart))
          currentHtml = html.slice(tagStart, currentPos + 1)
          currentTagName = getTagName(currentHtml)
          rethtml += onTag(
            currentTagName,
            currentHtml,
            isClosing(currentHtml)
          )
          lastPos = currentPos + 1
          tagStart = false
          continue
        }
        if ((c === '"' || c === "'") && html.charAt(currentPos - 1) === '=') {
          quoteStart = c
          continue
        }
      } else {
        if (c === quoteStart) {
          quoteStart = false
          continue
        }
      }
    }
  }
  if (lastPos < html.length) {
    rethtml += escapeHtml(html.substr(lastPos))
  }

  return rethtml
}

export function xss(html = '') {
  return parseTag(html)
}
