import { memo } from 'react'

const LoadingSpinner = memo(({ 
  size = 'medium', 
  text = '', 
  className = '' 
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size} ${className}`}>
      <div className="loading-spinner__icon" />
      {text && <span className="loading-spinner__text">{text}</span>}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
