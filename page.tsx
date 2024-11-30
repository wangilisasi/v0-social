import NewPost from "./new-post"
import SocialFeed from "./social-feed"

export default function Page() {
  return (
    <main className="min-h-screen bg-muted/20 py-8">
      <div className="container">
        <NewPost />
        <SocialFeed />
      </div>
    </main>
  )
}

