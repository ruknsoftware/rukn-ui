/**
 * Shared search helper for WidgetLink — calls Frappe core's own
 * /api/method/frappe.desk.search.search_link, the exact endpoint Desk's
 * native Link control uses. Doctype-agnostic, title_field-aware
 * server-side, so no client-side doctype-meta lookup is needed here —
 * same "generic Frappe-core endpoint" precedent as attachUploader.js's
 * upload_file call.
 */
export async function searchLink(doctype, txt, filters) {
  const params = new URLSearchParams({ doctype: doctype ?? '', txt: txt ?? '' })
  if (filters) params.set('filters', JSON.stringify(filters))

  const res = await fetch(`/api/method/frappe.desk.search.search_link?${params.toString()}`, {
    headers: { 'X-Frappe-CSRF-Token': window.csrf_token || '' },
  })
  const data = await res.json()
  return data?.message ?? []
}
