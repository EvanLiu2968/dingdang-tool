/**
 * List transform to Array tree.
 * @param  {Array} list
 * @return {Array} tree
 */
export function listToArrayTree(list, parentId = 0, idName = 'id', parentIdName = 'parentId', level = 99, depth) {
  if (!list.length) return []

  const itemArr = []
  for (let i = 0; i < list.length; i++) {
    const node = Object.assign({}, list[i])
    if (node[parentIdName] == parentId) {
      let cDepth = depth || 0 // 第一级重置为0
      cDepth++
      if (cDepth < level && !node.children) {
        node.children = listToArrayTree(list, node[idName], idName, parentIdName, level, cDepth)
      }
      itemArr.push(node)
    }
  }
  if (itemArr.length) {
    return itemArr
  }
}
/**
 * Tree transform to Array List.
 * @param  {Array} list
 * @return {Array} tree
 */
export function TreeToArrayList(tree, parentId = 0, list = [], idName = 'id') {
  if (!tree.length) return []

  for (let i = 0; i < tree.length; i++) {
    const node = Object.assign({}, tree[i])
    if (Array.isArray(node.children)) {
      TreeToArrayList(node.children, node[idName], list, idName)

      delete node.children
      node.parentId = parentId
      list.push(node)
    } else {
      node.parentId = parentId
      list.push(node)
    }
  }
  return list
}