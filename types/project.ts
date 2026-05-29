export interface Project {
  name: string
  description: string
  tech: string[]
  cover: string
  links?: {
    github?: string
    demo?: string
    article?: string
  }
  status: '已上线' | '进行中' | '已归档'
  year: number
}
