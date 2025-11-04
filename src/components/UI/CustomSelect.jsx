import { useState, useRef, useEffect } from 'react'

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите...',
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Закрытие при клике вне
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div
      ref={ref}
      style={{ position: 'relative', width: '100%', marginBottom: '8px' }}
    >
      {/* Поле */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          cursor: 'pointer',
          background: '#fff',
          userSelect: 'none',
        }}
      >
        {selectedLabel || <span style={{ color: '#888' }}>{placeholder}</span>}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            width: '100%',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            zIndex: 999,
          }}
        >
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
              style={{
                padding: '10px',
                cursor: 'pointer',
                background: o.value === value ? '#f0f0f0' : '#fff',
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
