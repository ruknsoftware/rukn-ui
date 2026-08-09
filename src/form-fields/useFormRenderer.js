import { computed } from 'vue'
import { resolveWidget } from './registry.js'
import { evaluateCondition } from './useConditionEvaluator'

/**
 * Groups schema fields into visible sections, resolves widget components,
 * and evaluates depends_on / mandatory_depends_on against live formData.
 *
 * @param {import('vue').Ref} schema  - reactive FormSchema ref
 * @param {import('vue').Ref} formData - reactive Record<string, unknown> ref
 */
export function useFormRenderer(schema, formData) {
  const sections = computed(() => {
    const result = [{ label: null, fields: [] }]

    for (const field of schema.value?.fields ?? []) {
      if (field.section_label) {
        result.push({ label: field.section_label, fields: [] })
      }

      const doc = formData.value ?? {}
      const visible = !field.hidden && evaluateCondition(field.depends_on, doc)
      const required =
        field.reqd === 1 ||
        Boolean(field.mandatory_depends_on && evaluateCondition(field.mandatory_depends_on, doc))

      result.at(-1).fields.push({
        descriptor: field,
        visible,
        required,
        widget: resolveWidget(field.fieldtype),
      })
    }

    // Drop sections that have no visible fields
    return result.filter((s) => s.fields.some((f) => f.visible))
  })

  return { sections }
}