import WidgetData from './WidgetData.vue'
import WidgetSmallText from './WidgetSmallText.vue'
import WidgetText from './WidgetText.vue'
import WidgetInt from './WidgetInt.vue'
import WidgetFloat from './WidgetFloat.vue'

import WidgetCheck from './WidgetCheck.vue'
import WidgetSelect from './WidgetSelect.vue'
import WidgetDate from './WidgetDate.vue'
import WidgetDatetime from './WidgetDatetime.vue'
import WidgetAttach from './WidgetAttach.vue'
import WidgetAttachImage from './WidgetAttachImage.vue'

export const WIDGET_REGISTRY = {
  Data: WidgetData,
  'Small Text': WidgetSmallText,
  Text: WidgetText,
  Int: WidgetInt,
  Float: WidgetFloat,

  Check: WidgetCheck,
  Select: WidgetSelect,
  Date: WidgetDate,
  Datetime: WidgetDatetime,
  Attach: WidgetAttach,
  'Attach Image': WidgetAttachImage,
}

export function resolveWidget(fieldtype) {
  return WIDGET_REGISTRY[fieldtype] ?? WidgetData
}