export function evaluateCondition(expression, doc) {
  if (!expression) return true
  const expr = expression.trim()
  if (!expr.startsWith('eval:')) return true
  try {
    // eslint-disable-next-line no-new-func
    return Boolean(new Function('doc', `return (${expr.slice(5)})`)(doc))
  } catch {
    return true // show field when expression is broken
  }
}