import { memo } from 'react'

const Select = memo(({ 
  label, 
  value, 
  onChange, 
  options = [], 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`select-field ${className}`}>
      {label && (
        <label className="select-field__label">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select-field__select"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon && `${option.icon} `}{option.label}
          </option>
        ))}
      </select>
    </div>
  )
})

Select.displayName = 'Select'

export default Select
