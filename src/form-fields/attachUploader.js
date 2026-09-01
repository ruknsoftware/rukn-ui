/**
 * Shared upload helper for WidgetAttach/WidgetAttachImage — posts straight to
 * Frappe's core /api/method/upload_file, the same endpoint and params core's
 * own per-field Attach control (frappe/public/js/frappe/form/controls/attach.js)
 * uses: doctype + docname + fieldname, no folder override (so uploads land in
 * Frappe's native default folder, "Home", same as core).
 */
export async function uploadAttachment(file, { doctype, docname, fieldname } = {}) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('is_private', '0')
  if (doctype) fd.append('doctype', doctype)
  if (docname) fd.append('docname', docname)
  if (fieldname) fd.append('fieldname', fieldname)

  const res = await fetch('/api/method/upload_file', {
    method: 'POST',
    headers: { 'X-Frappe-CSRF-Token': window.csrf_token || '' },
    body: fd,
  })
  const data = await res.json()
  return data?.message ?? null
}
