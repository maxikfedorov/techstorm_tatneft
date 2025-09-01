import { memo } from 'react'
import LoadingSpinner from './LoadingSpinner'

const Button = memo(({ 
  children, 
  loading = false, 
  disabled = false,
  variant = 'default',
  size = 'medium',
  className = '',
  onClick,
  ...props 
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`btn btn--${variant} btn--${size} ${className}`}
      data-loading={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="small" />}
      <span className="btn__content">{children}</span>
    </button>
  )
})

Button.displayName = 'Button'

export default Button
