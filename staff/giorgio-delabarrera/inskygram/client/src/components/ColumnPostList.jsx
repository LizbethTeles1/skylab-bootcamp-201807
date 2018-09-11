import React from 'react'
import ColumnPost from './ColumnPost';

const ColumnPostList = ({ posts, onPostDetailClick, onUserClick }) => {

  if (posts.length > 0) {
    return posts.map((post) =>
      (<ColumnPost
        key={post._id}
        post={post}
        onPostDetailClick={onPostDetailClick}
        onUserClick={onUserClick}
      />)
    )
  } else {
    return (
      <div>This is very empty <span role="img" aria-label="sad">😔</span>.
      Upload a photo or follow friends to be able to do what they do <span role="img" aria-label="wink">😉</span>
      </div>
    )
  }
}

export default ColumnPostList