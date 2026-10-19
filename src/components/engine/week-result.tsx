import { useState } from 'react'
import { Camera, Check, Clock, Copy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Post, WeekPlan } from '@/lib/week-plan'

function PostCard({ post }: { post: Post }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(' ')}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="h-full gap-3">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold tracking-wide text-primary uppercase">
            {post.day}
          </span>
          <Badge variant="secondary">
            <Clock aria-hidden /> {post.time}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{post.idea}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="flex gap-2 text-sm text-muted-foreground">
          <Camera className="mt-0.5 size-4 shrink-0" aria-hidden />
          {post.shot}
        </p>
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p className="line-clamp-3">{post.caption}</p>
          <p className="mt-2 truncate text-muted-foreground">{post.hashtags.join(' ')}</p>
        </div>
        <Button variant="outline" size="sm" className="mt-auto self-start" onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? 'Copié' : 'Copier le texte'}
        </Button>
      </CardContent>
    </Card>
  )
}

export function WeekResult({ plan }: { plan: WeekPlan }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {plan.posts.map((post) => (
        <li key={post.day}>
          <PostCard post={post} />
        </li>
      ))}
    </ol>
  )
}
