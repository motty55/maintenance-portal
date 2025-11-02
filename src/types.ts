import { z } from 'zod'

export const MaintenanceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  group: z.string(),
  service: z.string(),
  components: z.array(z.string()).optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  status: z.enum(['予定', '完了', '延期', '取消']),
  severity: z.enum(['情報', '低', '中', '高', '重大']),
  impact: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  published: z.boolean().optional(),
})

export const MaintenanceItemsSchema = z.array(MaintenanceItemSchema)

export type MaintenanceItem = z.infer<typeof MaintenanceItemSchema>
