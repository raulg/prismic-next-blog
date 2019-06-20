import React from 'react'
import { RichText, Date } from 'prismic-reactjs'
import { client } from '../prismic-configuration'
import Link from 'next/link'

const Post = (props) => (
  <div>
    <Link href='/'>
      <a>back to blog list</a>
    </Link>
    {RichText.render(props.post.data.title)}
    <span>{Date(props.post.data.date).toString()}</span>
    {RichText.render(props.post.data.post_body)}
  </div>
)

Post.getInitialProps = async (context) => {
  const { uid } = context.query
  const post = await client.getByUID('post', uid)

  if (context.res) {
    context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  }
  return { post }
}

export default Post
