export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "provincia-select"
  | "ciudad-search"

export type FormFieldConfig = {
  label: string
  name: string
  options?: { label: string; value: string }[]
  placeholder?: string
  required?: boolean
  type: FormFieldType
  validation?: {
    maxLength?: number
    minLength?: number
    pattern?: { message: string; regex: string }
  }
}

export type FormConfig = {
  campos: FormFieldConfig[]
  cc?: string[]
  descripcionExito?: string
  destinatario: string
  id: string
  subjectTemplate?: string
  titulo: string
  tituloExito?: string
}
