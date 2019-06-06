import React from 'react'
import Prismic from 'prismic-javascript'
import { RichText, Date } from 'prismic-reactjs'
import { apiEndpoint, accessToken, linkResolver, hrefResolver } from '../prismic-configuration'
import Link from 'next/link'

const BlogHome = (props) => (
  <div>
    <img src={props.home.data.image.url} alt='avatar image' />
    <h1>{RichText.asText(props.home.data.headline)}</h1>
    <p>{RichText.asText(props.home.data.description)}</p>

    <ul>
      {props.posts.results.map((post) => (
        <li key={post.uid}>
          <Link href={hrefResolver(post)} as={linkResolver(post)} passHref prefetch>
            <a>{RichText.render(post.data.title)}</a>
          </Link>
          <span>{Date(post.data.date).toString()}</span>
        </li>
      ))}
    </ul>
  </div>
)

BlogHome.getInitialProps = async (context) => {
  const req = context.req
  const API = await Prismic.getApi(apiEndpoint, { req, accessToken })
  const home = await API.getSingle('blog_home')
  const posts = await API.query(Prismic.Predicates.at('document.type', 'post'), { orderings: '[my.post.date desc]' })

  if (context.res) {
    context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  }

  return { home, posts }
}

export default BlogHome
