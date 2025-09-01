import { memo } from 'react'

const TextInput = memo(({ 
  value, 
  onChange, 
  onEnterPress,
  placeholder = '',
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onEnterPress) {
      onEnterPress()
    }
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={`text-input ${className}`}
      {...props}
    />
  )
})

TextInput.displayName = 'TextInput'

export default TextInput
